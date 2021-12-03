const cookieParser = require("cookie-parser");
const { hashSync, genSaltSync } = require("bcryptjs");
const Employee = require("../models/employee");
const { validationResult } = require("express-validator");

exports.addEmployee = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).send(validationResult(req));
  }
  const { body } = req;

  const salt = genSaltSync(10);
  body.password = hashSync(body.password, salt);
  body.company = res.locals.company;

  try {
    const data = await Employee.create(body);

    delete data.password;

    res.status(201).json({
      message: "Employee added successfully",
      data,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getEmployees = async (_, res) => {
  const { company } = res.locals;
  Employee.find(
    { company },
    ["name", "role", "position", "tasks"],
    (err, data) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({
        message: "Get employees successfully",
        data,
      });
    }
  );
};

exports.getEmployee = async (req, res) => {
  return res.status(200).json({
    message: "Get employee successfully",
    data: await Employee.findById(req.params.id, [
      "name",
      "role",
      "position",
      "email",
      "phone",
      "address",
    ]),
  });
};

exports.editEmployee = async (req, res) => {
  const { body } = req;
  if (body.password) {
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
  } else {
    delete body.password;
  }

  Employee.findByIdAndUpdate(req.params.id, body, (err, employee) => {
    if (err) return res.send(err);
    return res.json({
      message: "Employee edited successfully",
      data: employee,
    });
  });
};

exports.deleteEmployee = (req, res) => {
  Employee.findByIdAndDelete(req.params.id)
    .then((data) => {
      return res.json({
        message: "Employee deleted successfully",
        data,
      });
    })
    .catch((error) => {
      return res.json({
        error,
      });
    });
};
