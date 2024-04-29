const app = require("../../app");
const request = require("supertest");
const mongoose = require("mongoose");
const UserModel = require("../../models/User");
const PlaceModel = require("../../models/Place");
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
//   await PlaceModel.deleteMany();
// });

// Close database connection after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Place Routes Integration Tests", () => {
  let createdUserId = null,
    token = "",
    createdPlaceId = null;

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
    // console.log("token=", token);
  });

  test("should create a new place", async () => {
    const placeData = {
      title: "Test Place",
      address: "123 Test St",
      // Add other required fields
    };

    const response = await request(app)
      .post("/api/places")
      .set("Cookie", [`token=${token}`])
      .send(placeData);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Place");
    expect(response.body.owner).toBe(createdUserId);

    createdPlaceId = response.body._id;
  });

  test("should update the created place", async () => {
    const placeData = {
      id: createdPlaceId,
      title: "Test Place 2",
      address: "456 Updated St",
    };

    const response = await request(app)
      .put("/api/places")
      .set("Cookie", [`token=${token}`])
      .send(placeData);

    // expect(response.statusCode).toBe(200);
    // expect(response.body.title).toBe("Test Place 2");
    // expect(response.body.owner).toBe(createdUserId);

    // Check if the response is 'ok'
    expect(response.body).toBe("ok");

    // Fetch the updated place from the database
    const updatedPlace = await PlaceModel.findById(createdPlaceId);

    // Assert that the place was updated correctly
    expect(updatedPlace.title).toBe(placeData.title);
    expect(updatedPlace.address).toBe(placeData.address);
  });
});
