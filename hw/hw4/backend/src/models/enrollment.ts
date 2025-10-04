import mongoose, { Schema, Document } from "mongoose";

// Enrollment interface
export interface Enrollment extends Document {
  courses: {
    course: mongoose.Schema.Types.ObjectId;
    student: mongoose.Schema.Types.ObjectId;
    GPA?: number;
    dateEnrolled: Date;
  }[];
}

// Enrollment schema for MongoDB
const enrollmentSchema = new Schema<Enrollment>({
  courses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
      GPA: { type: Number, default: 0.0 },
      dateEnrolled: { type: Date, required: true },
    },
  ],
});

export default mongoose.model<Enrollment>("Enrollment", enrollmentSchema);