import request from "supertest";
import app from "../app.js";
import { connectTestDB, closeTestDB, clearTestDB } from "./setup.js";

beforeAll(async () => {
  await connectTestDB(); // Connect to test DB before running tests
});

afterAll(async () => {
  await closeTestDB(); // Close test DB after all tests
});

afterEach(async () => {
  await clearTestDB(); // Clear database state after each test
});

// Test CRUD operations for Student API
describe("Student API", () => {
  // Create a new student
  it("should create a new student", async () => {
    const res = await request(app).post("/api/students").send({
      firstName: "James",
      lastName: "Young",
      publicStudentId: "12345",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe("James");
  });

  // Get all students
  it("should fetch all students", async () => {
    await request(app).post("/api/students").send({
      firstName: "James",
      lastName: "Young",
      publicStudentId: "12345",
    });
    const res = await request(app).get("/api/students");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  // Get a student by publicStudentId
  it("should fetch a student by ID", async () => {
    const student = await request(app).post("/api/students").send({
      firstName: "James",
      lastName: "Young",
      publicStudentId: "12345",
    });
    const studentId = "12345";
    const res = await request(app).get(`/api/students/${studentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe("James");
  });

  // Delete a student by publicStudentId
  it("should delete a student", async () => {
    const student = await request(app).post("/api/students").send({
      firstName: "James",
      lastName: "Young",
      publicStudentId: "12345",
    });
    const studentId = "12345";
    const res = await request(app).delete(`/api/students/${studentId}`);
    expect(res.statusCode).toBe(200);
    const fetchDeleted = await request(app).get(`/api/students/${studentId}`);
    expect(fetchDeleted.statusCode).toBe(404);
  });

  // Update a student by publicStudentId
  it("should update a student", async () => {
    await request(app).post("/api/students").send({
      firstName: "James",
      lastName: "Young",
      publicStudentId: "12345",
    });
    const studentId = "12345";
    const res = await request(app).put(`/api/students/${studentId}`).send({
      firstName: "Jimmy",
      lastName: "Neutron",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe("Jimmy");
    expect(res.body.lastName).toBe("Neutron");
  });

  // Prevent creating a student with duplicate publicStudentId
  it("should not create a student with duplicate publicStudentId", async () => {
    await request(app).post("/api/students").send({
      firstName: "James",
      lastName: "Young",
      publicStudentId: "12345",
    });
    const res = await request(app).post("/api/students").send({
      firstName: "Jimbo",
      lastName: "You",
      publicStudentId: "12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("publicStudentId already exists");
  });
});