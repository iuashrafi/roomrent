const mongoose = require("mongoose");
const BookingModel = require("../../models/Booking");
const PlaceModel = require("../../models/Place");
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

describe("Booking Model", () => {
  beforeEach(async () => {
    // Clear the BookingModel collection before each test
    await BookingModel.deleteMany({});
    // Clear the PlaceModel collection before each test
    await PlaceModel.deleteMany({});
    // Clear the UserModel collection before each test
    await UserModel.deleteMany({});
  });

  it("should create a new booking", async () => {
    // Create a user
    const user = await UserModel.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    // Create a place
    const place = await PlaceModel.create({
      owner: user._id,
      title: "Test Place",
      address: "123 Test Street",
      photos: ["photo1.jpg", "photo2.jpg"],
      description: "A cozy place for testing",
      perks: ["WiFi", "Parking"],
      extraInfo: "No pets allowed",
      checkIn: 14, // 2 PM
      checkOut: 10, // 10 AM
      maxGuests: 4,
      price: 100,
    });

    const bookingData = {
      place: place._id,
      user: user._id,
      checkIn: new Date("2024-03-25"), // Sample check-in date
      checkOut: new Date("2024-03-28"), // Sample check-out date
      name: "Test Booking",
      phone: "1234567890",
      price: 300, // Sample booking price
    };

    const booking = await BookingModel.create(bookingData);

    expect(booking.place).toEqual(place._id);
    expect(booking.user).toEqual(user._id);
    expect(booking.checkIn).toEqual(bookingData.checkIn);
    expect(booking.checkOut).toEqual(bookingData.checkOut);
    expect(booking.name).toBe(bookingData.name);
    expect(booking.phone).toBe(bookingData.phone);
    expect(booking.price).toBe(bookingData.price);
  });
});
