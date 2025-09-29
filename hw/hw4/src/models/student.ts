import mongoose, { Schema, Document } from "mongoose";

// Student interface
export interface Student extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  publicStudentId: string;
  isDeleted?: Date;
}

// Student schema for MongoDB
const studentSchema = new Schema<Student>({
  firstName: { type: String, required: true, minlength: 1, maxlength: 255 },
  middleName: { type: String, minlength: 1, maxlength: 255 },
  lastName: { type: String, required: true, minlength: 1, maxlength: 255 },
  publicStudentId: { type: String, required: true, unique: true, minlength: 1, maxlength: 8 },
  isDeleted: { type: Date },
});

export default mongoose.model<Student>("Student", studentSchema);