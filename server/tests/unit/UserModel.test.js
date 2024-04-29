const mongoose = require("mongoose");
const UserModel = require("../../models/User");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("User Model", () => {
  beforeEach(async () => {
    // Clear the UserModel collection before each test
    await UserModel.deleteMany({});
  });

  it("should create a new user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };
    const user = await UserModel.create(userData);

    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
  });

  it("should not allow duplicate email addresses", async () => {
    const userData1 = {
      name: "Test User 1",
      email: "test@example.com",
      password: "password123",
    };
    const userData2 = {
      name: "Test User 2",
      email: "test@example.com", // Same email as userData1
      password: "password456",
    };

    // Create a user with userData1
    await UserModel.create(userData1);

    // Attempt to create a user with the same email as userData1
    try {
      await UserModel.create(userData2);

      expect(true).toBe(false);
    } catch (error) {
      expect(error.code).toBe(11000); // Check for duplicate key error code
    }
  });
});
