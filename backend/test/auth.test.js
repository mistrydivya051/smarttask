import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';

const { expect } = chai;
chai.use(chaiHttp);

describe("Auth API Tests", () => {
  // generate unique email for each run
  const testEmail = `student${Date.now()}@example.com`;
  const testPassword = "123456";

  it("should register a new user", (done) => {
    chai.request(app)
      .post("/api/auth/register")
      .send({ name: "Student", email: testEmail, password: testPassword })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("token");
        expect(res.body.email).to.equal(testEmail);
        done();
      });
  });

  it("should login the user", (done) => {
    chai.request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: testPassword })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        expect(res.body.email).to.equal(testEmail);
        done();
      });
  });
});
