const Employee = require("../models/employee");
const jwt = require("jsonwebtoken");
const { hashSync, genSaltSync, compare } = require("bcryptjs");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  Employee.findOne({ email }, (err, employee) => {
    if (err) throw err;
    if (!employee) {
      return res.status(401).json({ message: "Login Failed" });
    }

    compare(password, employee.password, (err, success) => {
      if (err) throw err;
      if (!success) {
        return res.status(401).json({ message: "Login failed" });
      }

      const { name, _id, role, company } = employee;

      jwt.sign(
        { name, _id, role, company },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            message: "Login success",
            data: {
              name,
              role,
              token,
            },
            // token: hashSync(token, genSaltSync(10)),
          });
        }
      );
    });
  }).select("+password");
};

exports.logout = (_, res) => {
  res.status(200).json({ message: "Logout success!" });
};
