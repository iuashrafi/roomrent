const app = require("../../app");
const request = require("supertest");
const mongoose = require("mongoose");
const UserModel = require("../../models/User");
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

// // Clear users collection in the test database after each test
// afterEach(async () => {
//   await UserModel.deleteMany();
// });

// Close database connection after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Auth Routes Integration Tests", () => {
  let createdUserId = null;

  test("should register a new user", async () => {
    const userData = {
      name: "john doe",
      email: "test@example.com",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    createdUserId = response.body._id;
  });

  test("should return 400 if registering with existing email", async () => {
    const existingUser = {
      name: "existing user",
      email: "test@example.com",
      password: "testpassword",
    };

    // Attempt to register with the same email again
    const response = await request(app)
      .post("/api/auth/register")
      .send(existingUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Email already exists!");
  });

  test("should return 400 if registering with missing fields", async () => {
    const userData = {
      name: "john doe",
      // Missing email field
      password: "testpassword",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.statusCode).toBe(400); // bad request
    // expect(response.body.error).toBeDefined();
  });

  test("should login successfully with correct credentials", async () => {
    const userData = {
      email: "test@example.com",
      password: "testpassword",
    };

    const response = await request(app).post("/api/auth/login").send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(createdUserId);
  });

  test("should return 422 if logging in with incorrect password", async () => {
    const userData = {
      email: "test@example.com",
      password: "incorrectpassword",
    };

    const response = await request(app).post("/api/auth/login").send(userData);

    expect(response.statusCode).toBe(422);
    // expect(response.body.error).toBeDefined();
  });

  test("should return 404 if logging in with nonexistent user", async () => {
    const userData = {
      email: "nonexistent@example.com",
      password: "testpassword",
    };

    const response = await request(app).post("/api/auth/login").send(userData);

    expect(response.statusCode).toBe(404); // not found
    // expect(response.body.error).toBeDefined();
  });

  test("should logout successfully", async () => {
    // Log in first to obtain a JWT token
    const userData = {
      email: "test@example.com",
      password: "testpassword",
    };

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(userData);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body._id).toBe(createdUserId);

    // Extract the token from the login response
    const token = loginResponse.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    console.log("token=", token);
    // Attempt to logout
    const logoutResponse = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", [`token=${token}`]);

    expect(logoutResponse.statusCode).toBe(200);
    expect(logoutResponse.body).toBe(true);
  });
});
