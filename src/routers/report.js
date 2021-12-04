const { body } = require("express-validator");
const { authorize } = require("../utils/authorization");
const {
  getReports,
  getReport,
  addReport,
  editReport,
  deleteReport,
  workReport,
  finishReport,
  editTaskReport,
  addTaskReport,
} = require("../controllers/report");

const router = require("express")();

router.get("/", authorize("employee"), getReports);
router.get("/:reportId", authorize("employee"), getReport);
router.post("/", authorize("employee"), body("deadline").isDate(), addReport);
router.post("/task", authorize("employee"), addTaskReport);
router.put("/:reportId/:taskId", authorize("employee"), editTaskReport);
router.put("/:reportId", authorize("employee"), editReport);
// router.put("/work/:reportId", authorize("employee"), workReport);
// router.post(
//   "/finish/:reportId",
//   authorize("employee"),
//   body("Report_start").isDate(),
//   body("Report_end").isDate(),
//   finishReport
// );
router.delete("/:reportId", authorize("employee"), deleteReport);
router.delete("/:reportId/:taskId", authorize("employee"), deleteReport);

module.exports = router;
