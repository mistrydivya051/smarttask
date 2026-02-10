import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import User from '../models/User.js';
import Team from '../models/Team.js';
import TeamMember from '../models/TeamMember.js';

const { expect } = chai;
chai.use(chaiHttp);

describe("Team API Tests", () => {
  let token;
  let testUserId;
  let teamId;

  const testEmail = `student${Date.now()}@example.com`;
  const testPassword = "123456";

  before(async () => {
    // create a test user
    const res = await chai.request(app)
      .post("/api/auth/register")
      .send({ name: "Student", email: testEmail, password: testPassword });

    token = res.body.token;
    testUserId = res.body.id;
  });

  after(async () => {
    // clean up test data
    await User.deleteOne({ _id: testUserId });
    await Team.deleteOne({ _id: teamId });
    await TeamMember.deleteMany({ user: testUserId });
  });

  it("should create a new team", (done) => {
    chai.request(app)
      .post("/api/team/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Team", description: "Team for testing" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("team");
        expect(res.body.team.name).to.equal("Test Team");
        teamId = res.body.team._id;
        done();
      });
  });

  it("should get all teams including the created team", (done) => {
    chai.request(app)
      .get("/api/team")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.teams).to.be.an("array");
        const team = res.body.teams.find(t => t._id === teamId);
        expect(team).to.exist;
        expect(team.membersCount).to.equal(1); // owner added automatically
        done();
      });
  });

  it("should get team members", (done) => {
    chai.request(app)
      .get(`/api/team/members/${teamId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.members).to.be.an("array");
        const owner = res.body.members.find(m => m.role === "Owner");
        expect(owner).to.exist;
        expect(owner.user._id).to.equal(testUserId);
        done();
      });
  });

});
