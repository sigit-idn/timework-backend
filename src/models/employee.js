const { Schema, model } = require("mongoose");

const employeeSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    position: { type: String, required: true },
    role: { type: String, required: true }, //employee, admin, superadmin
    company: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },
    address: String,
    attendances: [
      {
        date: Date,
        work_start: Date,
        work_end: Date,
        break_start: Date,
        break_end: Date,
      },
    ],
    reports: [
      {
        date: Date,
        tasks: [
          {
            task_start: { type: Date, required: true },
            task_end: { type: Date, required: true },
            title: String,
            description: String,
          },
        ],
        notes: String,
      },
    ],
    tasks: [
      {
        title: { type: String, required: true },
        description: String,
        deadline: { type: Date, required: true },
        is_working: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Employee = model("Employee", employeeSchema);

module.exports = Employee;
