const Employee = require("../models/employee");

exports.getReports = async (req, res) => {
  const { month, userId } = req.query;
  try {
    const employee = await Employee.findById(
      userId ?? res.locals._id,
      "reports"
    );
    const data = employee.reports.filter(
      ({ date }) =>
        new Date(date).getFullYear() ===
          new Date(month ?? new Date()).getFullYear() &&
        new Date(date).getMonth() === new Date(month ?? new Date()).getMonth()
    );

    res.status(200).json({
      message: "Get reports successfuly",
      data,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getReport = async (req, res) => {
  try {
    const employee = await Employee.findById(res.locals._id, "reports");
    const report = employee.reports.find(({ _id }) => _id == req.params.taskId);

    res.status(200).json({
      message: "Get report successfuly",
      data: report,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.addReport = async (req, res) => {
  const { date, job_start, job_end, title, description } = req.body;

  try {
    const employee = await Employee.findById(res.locals._id, "reports");

    employee.reports.push({ date, job_start, job_end, title, description });

    employee.save();

    res.status(200).json({
      message: "Add tasks successfuly",
      data: employee.reports,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.addTaskReport = async (req, res) => {
  try {
    const employee = await Employee.findById(res.locals._id, [
      "reports",
      "tasks",
    ]);

    const todayReport = employee.reports.find(
      (report) =>
        report.date?.toLocaleDateString() == new Date().toLocaleDateString()
    );

    if (todayReport) {
      req.body.task_start =
        todayReport.tasks[todayReport.tasks.length - 1]?.task_end ??
        req.body.task_start;

      todayReport.tasks.push(req.body);
    } else {
      employee.reports.push({
        date: new Date(),
        tasks: [req.body],
      });
    }

    // employee.tasks.forEach((task, i) => {
    //   if (task._id == taskId) employee.tasks.splice(i, 1);
    // });

    const data = await employee.save();

    res.status(200).json({
      message: "Task finished successfuly",
      data,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.editReport = async (req, res) => {
  const { reportId } = req.params;

  try {
    const employee = await Employee.findById(res.locals._id, "reports");

    const report = employee.reports.find(({ _id }) => _id == reportId);

    for (key in req.body) {
      report[key] = req.body[key];
    }

    const data = await employee.save();

    res.status(200).json({
      message: "Edit reports successfuly",
      data,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.editTaskReport = async (req, res) => {
  const { reportId, taskId } = req.params;

  try {
    const employee = await Employee.findById(res.locals._id, "reports");

    const task = employee.reports
      .find(({ _id }) => _id == reportId)
      .tasks.find(({ _id }) => _id == taskId);

    for (key in req.body) {
      task[key] = req.body[key];
    }

    const data = await employee.save();

    res.status(200).json({
      message: "Edit reports successfuly",
      data,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteReport = async (req, res) => {
  const { reportId, taskId } = req.params;
  try {
    const employee = await Employee.findById(res.locals._id, "reports");
    const { reports } = employee;

    reports
      .find(({ _id }) => _id == reportId)
      .tasks.forEach(({ _id }, i, tasks) => {
        if (_id == taskId) tasks.splice(i, 1);
      });

    const data = await employee.save();

    res.status(200).json({
      message: "Delete task successfuly",
      data,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteTaskReport = async (req, res) => {
  const { reportId, taskId } = req.params;
  try {
    const employee = await Employee.findById(res.locals._id, "reports");
    const { reports } = employee;

    const task = reports.tasks.find(({ _id }) => _id == reportId);

    reports[0].tasks.splice(reports[0].tasks.indexOf(reportId), 1);

    employee.save();

    res.status(200).json({
      message: "Delete reports successfuly",
      data: report,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};
