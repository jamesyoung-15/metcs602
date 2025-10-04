import request from "supertest";
import app from "../app.js";
import { connectTestDB, closeTestDB, clearTestDB } from "./setup.js";

beforeAll(connectTestDB);
afterAll(closeTestDB);
afterEach(clearTestDB);

describe("Enrollment API", () => {
  it("should fetch all courses for a student", async () => {
    const publicStudentId = "12345";
    const student = await request(app).post("/api/students").send({
      firstName: "James",
      lastName: "Young",
      publicStudentId: publicStudentId,
    });

    const course = await request(app).post("/api/courses").send({
      publicCourseId: "METCS602",
      courseName: "METCS 602",
      semester: "Fall",
      year: 2025,
      enabled: true,
    });

    const enrollment = await request(app).post("/api/enrollments").send({
      studentId: publicStudentId,
      courseId: course.body._id,
      dateEnrolled: new Date(),
    });

    const res = await request(app).get(`/api/enrollments/${publicStudentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].course.courseName).toBe("METCS 602");
  });
  it("should return 404 for non-existent student", async () => {
    const res = await request(app).get("/api/enrollments/99999");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Student not found");
  });
});