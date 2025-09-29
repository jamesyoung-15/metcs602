import mongoose, { Schema, Document } from "mongoose";

// Course interface
export interface Course extends Document {
  publicCourseId: string;
  courseName: string;
  semester: string;
  year: number;
  enabled: boolean;
}

// Course schema for MongoDB
const courseSchema = new Schema<Course>({
  publicCourseId: { type: String, required: true, unique: true, minlength: 1, maxlength: 10 },
  courseName: { type: String, required: true, minlength: 1, maxlength: 512 },
  semester: { type: String, required: true, minlength: 1, maxlength: 48 },
  year: { type: Number, required: true },
  enabled: { type: Boolean, required: true, default: false },
});

export default mongoose.model<Course>("Course", courseSchema);