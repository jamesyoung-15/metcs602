import request from "supertest";
import app from "../app.js";
import { connectTestDB, closeTestDB, clearTestDB } from "./setup.js";

beforeAll(connectTestDB);
afterAll(closeTestDB);
afterEach(clearTestDB);

describe("Enrollment API", () => {
  it("should fetch all courses for a student", async () => {
    const student = await request(app).post("/api/students").send({
      firstName: "John",
      lastName: "Doe",
      publicStudentId: "12345",
    });

    const course = await request(app).post("/api/courses").send({
      publicCourseId: "COURSE123",
      courseName: "Math 101",
      semester: "Fall",
      year: 2023,
      enabled: true,
    });

    const enrollment = await request(app).post("/api/enrollments").send({
      studentId: student.body._id,
      courseId: course.body._id,
      dateEnrolled: new Date(),
    });

    const res = await request(app).get(`/api/enrollments?studentId=${student.body._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].course.courseName).toBe("Math 101");
  });
});