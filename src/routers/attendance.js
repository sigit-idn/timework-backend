const { body, param } = require("express-validator");
const { authorize } = require("../utils/authorization");
const {
  getAttendances,
  addAttendance,
  editAttendance,
  getAttendance,
} = require("../controllers/attendance");

const router = require("express")();

router.get("/", authorize("employee"), getAttendances);
router.get("/today", authorize("employee"), getAttendance);
router.post(
  "/:type",
  authorize("employee"),
  param("type").isIn(["work_start", "work_end", "break_start", "break_end"]),
  addAttendance
);
router.put("/:attendanceId", authorize("admin"), editAttendance);

module.exports = router;
