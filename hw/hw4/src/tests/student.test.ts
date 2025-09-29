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

describe("Student API", () => {
  it("should create a new student", async () => {
    const res = await request(app).post("/api/students").send({
      firstName: "John",
      lastName: "Doe",
      publicStudentId: "12345",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe("John");
  });

  it("should fetch all students", async () => {
    await request(app).post("/api/students").send({
      firstName: "John",
      lastName: "Doe",
      publicStudentId: "12345",
    });
    const res = await request(app).get("/api/students");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("should fetch a student by ID", async () => {
    const student = await request(app).post("/api/students").send({
      firstName: "John",
      lastName: "Doe",
      publicStudentId: "12345",
    });
    const studentId = student.body._id;
    const res = await request(app).get(`/api/students/${studentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe("John");
  });

  it("should delete a student", async () => {
    const student = await request(app).post("/api/students").send({
      firstName: "John",
      lastName: "Doe",
      publicStudentId: "12345",
    });
    const studentId = student.body._id;
    const res = await request(app).delete(`/api/students/${studentId}`);
    expect(res.statusCode).toBe(200);
    const fetchDeleted = await request(app).get(`/api/students/${studentId}`);
    expect(fetchDeleted.statusCode).toBe(404);
  });
});