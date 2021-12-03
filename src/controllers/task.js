const Employee = require("../models/employee");
const notifications = require("../utils/notifications");

exports.getTasks = async (req, res) => {
  try {
    const userId = req.query["user-id"] ?? res.locals._id;
    const employee = await Employee.findById(userId, "tasks");

    const data = employee.tasks.sort((a, b) =>
      a.deadline > b.deadline ? 1 : b.deadline > a.deadline ? -1 : 0
    );

    res.status(200).json({ message: "Get tasks successfuly", data });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getTask = async (req, res) => {
  try {
    const employee = await Employee.findById(res.locals._id, "tasks");

    const task = employee.tasks.find(({ _id }) => _id == req.params.taskId);

    res.status(200).json({
      message: "Get tasks successfuly",
      data: task,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.addTask = async (req, res) => {
  const { title, description, deadline } = req.body;
  const userId = req.query["user-id"] ?? res.locals._id;
  try {
    const employee = await Employee.findById(userId, "tasks");

    employee.tasks.push({ title, description, deadline });

    const data = await employee.save();

    res.status(201).json({
      message: "Add tasks successfuly",
      data,
    });

    if (userId != res.locals._id) {
      notifications.add = {
        from: (await Employee.findById(res.locals._id, "name")).name,
        to: userId,
        taskId: data.tasks.find(
          ({
            title: taskTitle,
            deadline: taskDeadline,
            description: taskDescription,
          }) =>
            title === taskTitle &&
            new Date(deadline).toString() ===
              new Date(taskDeadline).toString() &&
            description === taskDescription
        )._id,
        title,
        description,
        deadline,
      };
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.workTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const employee = await Employee.findById(res.locals._id, "tasks");

    employee.tasks.forEach(
      (task) => (task.is_working = task._id == taskId ? true : false)
    );

    const data = await employee.save();

    res.status(200).json({
      message: "Edit tasks successfuly",
      data,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.editTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const employee = await Employee.findById(res.locals._id, "tasks");

    const task = employee.tasks.find(({ _id }) => _id == taskId);

    for (key in req.body) {
      task[key] = req.body[key];
    }

    const data = await employee.save();

    res.status(200).json({
      message: "Edit tasks successfuly",
      data,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const employee = await Employee.findById(res.locals._id, "tasks");
    const { tasks } = employee;

    tasks.forEach((task, i) => {
      if (task._id == taskId) employee.tasks.splice(i, 1);
    });

    const data = await employee.save();

    res.status(200).json({
      message: "Delete tasks successfuly",
      data,
    });

    notifications.remove = taskId;
  } catch (err) {
    res.status(400).send(err);
  }
};
