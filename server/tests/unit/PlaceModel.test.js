const mongoose = require("mongoose");
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

describe("Place Model", () => {
  beforeEach(async () => {
    // Clear the PlaceModel collection before each test
    await PlaceModel.deleteMany({});
    // Clear the UserModel collection before each test
    await UserModel.deleteMany({});
  });

  it("should create a new place", async () => {
    // Create a user to be the owner of the place
    const user = await UserModel.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const placeData = {
      owner: user._id, // Assign the user's ObjectId as the owner
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
    };

    const place = await PlaceModel.create(placeData);

    expect(place.owner).toEqual(user._id);
    expect(place.title).toBe(placeData.title);
    expect(place.address).toBe(placeData.address);
    expect(place.photos).toEqual(placeData.photos);
    expect(place.description).toBe(placeData.description);
    expect(place.perks).toEqual(placeData.perks);
    expect(place.extraInfo).toBe(placeData.extraInfo);
    expect(place.checkIn).toBe(placeData.checkIn);
    expect(place.checkOut).toBe(placeData.checkOut);
    expect(place.maxGuests).toBe(placeData.maxGuests);
    expect(place.price).toBe(placeData.price);
  });
});
