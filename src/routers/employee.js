const express = require("express");
const { body } = require("express-validator");
const { authorize } = require("../utils/authorization");
const {
  addEmployee,
  getEmployees,
  getEmployee,
  editEmployee,
  deleteEmployee,
} = require("../controllers/employee");

const router = express();

router.post(
  "/",
  authorize("admin"),
  body("name").matches(/^[一-龠ぁ-ゔァ-ヴーa-zA-Zａ-ｚＡ-Ｚ々〆〤 ]{2,}$/u),
  body("position").notEmpty(),
  body("phone").matches(/^.{0}$|^(0|\+|\()(\d|\s\d|-\d){5,16}$/),
  body("role").isIn(["employee", "admin", "superadmin"]),
  body("email").isEmail(),
  addEmployee
);

router.get("/", authorize("employee"), getEmployees);
router.get("/:id", authorize("admin"), getEmployee);
router.put("/:id", authorize("admin"), editEmployee);
router.delete("/:id", authorize("admin"), deleteEmployee);

module.exports = router;
