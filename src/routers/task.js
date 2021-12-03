const { body } = require("express-validator");
const { authorize } = require("../utils/authorization");
const {
  getTasks,
  getTask,
  addTask,
  editTask,
  deleteTask,
  workTask,
  // finishTask,
} = require("../controllers/task");
const sendNotification = require("../utils/sendNotification");

const router = require("express")();

router.get("/", authorize("employee"), getTasks, sendNotification);
router.get("/:taskId", authorize("employee"), getTask);
router.post(
  "/",
  authorize("employee"),
  body("deadline").isDate().exists(),
  addTask
);
router.put(
  "/:taskId",
  authorize("employee"),
  body("deadline").isDate(),
  editTask
);
router.put("/work/:taskId", authorize("employee"), workTask);
// router.post(
//   "/finish/:taskId",
//   authorize("employee"),
//   body("task_start").isDate(),
//   body("task_end").isDate(),
//   finishTask
// );
router.delete("/:taskId", authorize("employee"), deleteTask, sendNotification);

module.exports = router;
