const { hashSync, genSaltSync } = require("bcryptjs");
const { internet, date, time } = require("faker");
const faker = require("faker");
const { cell_phone, name, title } = require("faker/lib/locales/ja");
const { address, lorem, fake } = require("faker/locale/ja");
const Employee = require("../models/employee");

const employees = [];

for (let i = 0; i < 2; i++) {
  employees.push({
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    password: hashSync("password", genSaltSync(10)),
    role: "employee",
    company: "6198a3bd959679e5e537a2ca",
    address: faker.address.streetAddress(),
    attendances: [
      {
        date: faker.date.between("2021/08/01", "2021/12/31"),
        work_start: faker.time.recent(),
        work_end: faker.time.recent(),
        break_start: faker.time.recent(),
        break_end: faker.time.recent(),
      },
    ],
    reports: [
      {
        date: date.between("2021/08/01", "2021/12/31"),
        tasks: [
          {
            task_start: faker.time.recent(),
            task_end: faker.time.recent(),
            title: faker.lorem.words(),
            description: faker.lorem.paragraphs(),
          },
        ],
        notes: lorem.paragraph(),
      },
    ],
    tasks: [
      {
        title: faker.lorem.words(),
        description: faker.lorem.paragraphs(),
        deadline: date.between("2021/11/30", "2021/12/31"),
        is_working: false,
      },
    ],
  });
}

console.log(
  employees,
  employees[0].tasks,
  employees[0].reports,
  employees[0].attendances
);
