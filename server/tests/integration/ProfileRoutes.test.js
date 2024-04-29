const app = require("../../app");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongod;

// Connect to a test database
beforeAll(async () => {
  mongod = await MongoMemoryServer.create(); // Use create() instead of new MongoMemoryServer()
  const uri = mongod.getUri(); // No need to await here
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Close database connection after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Profile routes Integration tests", () => {
  let createdUserId = null,
    token = "";

  test("should register a new user and login successfully", async () => {
    // registering a new user
    const userData = {
      name: "john doe",
      email: "test@example.com",
      password: "testpassword",
    };
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(registerResponse.statusCode).toBe(200);
    createdUserId = registerResponse.body._id;

    // logging user
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });

    expect(loginResponse.statusCode).toBe(200); // logged in successfully
    token = loginResponse.headers["set-cookie"][0].split(";")[0].split("=")[1];
  });
});
