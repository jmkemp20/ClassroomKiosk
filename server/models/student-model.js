const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    parent_id: { type: Schema.ObjectId, ref: "User", required: true },
    classroom: String,
    email: String,
    num_books: Number,
    book_list: [
      {
        type: Schema.ObjectId,
        ref: "Book",
        required: true,
      },
    ],
    checkout_list: [
      Number,
    ]
  },
  { collection: "ClassroomStudents", timestamps: true }
);

const Student = mongoose.model("student", studentSchema);

module.exports = { Student };
