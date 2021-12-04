const { validationResult } = require("express-validator");
const Employee = require("../models/employee");

exports.getAttendances = async (req, res) => {
  try {
    const employee = await Employee.findById(res.locals._id, "attendances");
    const data = employee.attendances.filter(
      ({ date }) =>
        new Date(date).getFullYear() ===
          new Date(req.query.month ?? new Date()).getFullYear() &&
        new Date(date).getMonth() ===
          new Date(req.query.month ?? new Date()).getMonth()
    );

    res.status(200).json({
      message: "Get attendances successfuly",
      data,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const employee = await Employee.findById(res.locals._id, "attendances");

    const todayAttendance = employee.attendances.find(
      ({ date }) =>
        date && date.toLocaleDateString() == new Date().toLocaleDateString()
    );

    res.status(200).json({
      message: "Get today attendance successfuly",
      data: todayAttendance,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.addAttendance = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).send(validationResult(req));
  }

  const { type } = req.params;

  // Employee.findByIdAndUpdate(
  //   res.locals._id,{attendances:true},
  //   {
  //     $addToSet: {
  //       data: new Date(),
  //       [type]: new Date(),
  //     },
  //   },
  //   (err, attendance) => {
  //     if (err) return res.status(400).send(err);

  //     res.status(200).json({
  //       message: `Set ${type} successfuly`,
  //       data: attendance,
  //     });
  //   }
  // );

  try {
    const employee = await Employee.findById(res.locals._id, "attendances");
    const { type } = req.params;

    const todayAttendance = employee.attendances.find(
      ({ date }) =>
        date && date.toLocaleDateString() == new Date().toLocaleDateString()
    );

    if (!todayAttendance) {
      const newAttendance = {};
      newAttendance.date = new Date();
      newAttendance[type] = new Date();
      employee.attendances.push(newAttendance);

      employee.save();
      return res.status(200).json({
        message: "Set attandance successfully",
        data: newAttendance,
      });
    }

    todayAttendance[type] = new Date();

    employee.save();
    res.status(200).json({
      message: `Set ${type} successfuly`,
      data: todayAttendance,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.editAttendance = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).send(validationResult(req));
  }

  try {
    const employee = await Employee.findById(res.locals._id, "attendances");

    const attendance = employee.attendances.find(
      ({ _id }) => _id == req.body.attendance_id
    );

    for (key in req.body) {
      attendance[key] = req.body[key];
    }

    employee.save();
    res.status(200).json({
      message: `Set ${type} successfuly`,
      data: attendance,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};
