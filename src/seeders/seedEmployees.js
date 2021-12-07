const { hashSync, genSaltSync } = require("bcryptjs");
const { internet, date, time } = require("faker");
const faker = require("faker");
const { cell_phone, name, title } = require("faker/lib/locales/ja");
const { address, lorem, fake } = require("faker/locale/ja");
const connectDb = require("../config/db");
const Employee = require("../models/employee");
require("dotenv").config();

const seed = async () => {
  connectDb();

  const employees = [];
  const roles = ["employee", "admin", "superadmin"];
  const positions = [
    "Back-End Engineer",
    "DevOps",
    "Data Engineer",
    "Machine Learning Engineer",
    "Software Architech",
  ];

  for (let i = 0; i < 10; i++) {
    roles[i] = i >= roles.length ? faker.name.findName() : roles[i];
    employees.push({
      name: roles[i],
      phone: "0802155" + Math.round(Math.random() * 10000),
      email:
        roles[i]
          .toLowerCase()
          .replace(/(?<=\s|^)\S{1,3}\.*(\W|$)/g, "")
          .replace(/\s/g, ".") + "@email.com",
      password: hashSync("password", genSaltSync(10)),
      role: roles[i],
      position: positions[Math.floor(Math.random() * positions.length)],
      company: "61830b6d0fe11d303ec30cbc",
      address: faker.address.streetAddress(),
      attendances: Array.from(
        { length: 10 },
        () =>
          new (function () {
            this.date = faker.date.between(
              "2021/11/15",
              new Date().toLocaleDateString()
            );
            this.work_start = new Date(
              this.date.getTime() + Math.random(8) * 60 * 60 * 1000
            );
            this.work_end = new Date(this.date.getTime() + 10 * 60 * 60 * 1000);
            this.break_start = new Date(
              this.work_start.getTime() + 4 * 60 * 60 * 1000
            );
            this.break_end = new Date(
              this.break_start.getTime() + 1 * 60 * 60 * 1000
            );
          })()
      ),
      reports: Array.from(
        { length: 10 },
        () =>
          new (function () {
            this.date = date.between(
              "2021/11/15",
              new Date().toLocaleDateString()
            );
            this.tasks = Array.from({ length: 10 }, () => ({
              task_start: new Date(this.date.getTime() + 8 * 60 * 60 * 1000),
              task_end: new Date(this.date.getTime() + 10 * 60 * 60 * 1000),
              title: faker.lorem.words(),
              description: faker.lorem.paragraphs(),
            }));
            this.notes = lorem.paragraph();
          })()
      ),

      tasks: Array.from({ length: 20 }, () => ({
        title: faker.lorem.words(),
        description: faker.lorem.paragraphs(),
        deadline: date.between(new Date().toLocaleDateString(), "2021/12/31"),
        is_working: false,
      })),
    });
  }

  try {
    await Employee.deleteMany();
    await Employee.insertMany(employees);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

seed();
