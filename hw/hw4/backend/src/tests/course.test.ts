import request from "supertest";
import app from "../app.js";
import { connectTestDB, closeTestDB, clearTestDB } from "./setup.js";

// Setup and teardown for test database w/ in-memory MongoDB
beforeAll(connectTestDB);
afterAll(closeTestDB);
afterEach(clearTestDB);

describe("Course API", () => {
  it("should fetch all enabled courses", async () => {
    await request(app).post("/api/courses").send({
      publicCourseId: "COURSE123",
      courseName: "Math 101",
      semester: "Fall",
      year: 2023,
      enabled: true,
    });
    await request(app).post("/api/courses").send({
      publicCourseId: "COURSE124",
      courseName: "History 101",
      semester: "Fall",
      year: 2023,
      enabled: false,
    });
    const res = await request(app).get("/api/courses/enabled");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].courseName).toBe("Math 101");
  });
  it("should error when getting non-existent student enrollments", async () => {
    const res = await request(app).get("/api/enrollments/99999");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Student not found");
  });
});