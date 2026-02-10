import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js'; // your Express app
import User from '../models/User.js';
import Team from '../models/Team.js';
import TeamMember from '../models/TeamMember.js';
import Task from '../models/Task.js';

const { expect } = chai;
chai.use(chaiHttp);

describe("Task API Tests", () => {
  let token;
  let testUserId;
  let teamId;
  let taskId;

  const testEmail = `student${Date.now()}@example.com`;
  const testPassword = "123456";

  before(async () => {
    // create a test user
    const res = await chai.request(app)
      .post("/api/auth/register")
      .send({ name: "Student", email: testEmail, password: testPassword });

    token = res.body.token;
    testUserId = res.body.id;

    // create a test team
    const teamRes = await chai.request(app)
      .post("/api/team/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Team", description: "Team for testing tasks" });

    teamId = teamRes.body.team._id;
  });

  after(async () => {
    // clean up test data
    await Task.deleteMany({ team: teamId });
    await Team.deleteOne({ _id: teamId });
    await TeamMember.deleteMany({ user: testUserId });
    await User.deleteOne({ _id: testUserId });
  });

  it("should create a new task", (done) => {
    chai.request(app)
      .post("/api/task/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "This is a test task",
        priority: "High",
        team: teamId
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("task");
        expect(res.body.task.title).to.equal("Test Task");
        taskId = res.body.task._id;
        done();
      });
  });

  it("should get all tasks for the team", (done) => {
    chai.request(app)
      .get(`/api/task/team/${teamId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.tasks).to.be.an("array");
        const task = res.body.tasks.find(t => t._id === taskId);
        expect(task).to.exist;
        done();
      });
  });

  it("should get all tasks for the logged-in user", (done) => {
    chai.request(app)
      .get("/api/task")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.tasks).to.be.an("array");
        const task = res.body.tasks.find(t => t._id === taskId);
        expect(task).to.exist;
        done();
      });
  });

});
