const app = require("../../app");
const mongoose = require("mongoose");
const request = require("supertest");
const BookingModel = require("../../models/Booking");
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
    console.log("token=", token);
  });

  test("should book a new place", async () => {
    // const bookingData = {
    //   place: createdPlaceId,
    //   user: createdUserId,
    //   checkIn: new Date("2024-04-01"), // Set a fake check-in date
    //   checkOut: new Date("2024-04-05"), // Set a fake check-out date
    //   numberOfGuests: 2,
    //   name: "Test user",
    //   phone: "1234567890",
    //   price: 100,
    // };

    const bookingData = {
      place: createdPlaceId,
      user: createdUserId,
      checkIn: new Date("2024-04-01"), // Set a fake check-in date
      checkOut: new Date("2024-04-05"), // Set a fake check-out date
      name: "John Doe", // Set a fake name
      phone: "1234567890", // Set a fake phone number
      price: 500, // Set a fake price
    };

    const response = await request(app)
      .post("/api/bookings")
      .set("Cookie", [`token=${token}`])
      .send(bookingData);

    expect(response.statusCode).toBe(200);
    expect(response.body.place).toBe(createdPlaceId);
    expect(response.body.user).toBe(createdUserId);
    expect(response.body.name).toBe(bookingData.name);
  });
});
