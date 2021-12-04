const { authorize } = require("../utils/authorization");
const router = require("express")();
const { login, logout } = require("../controllers/authentication");

router.post("/login", login);
// router.post("/login", authorize("guest"), login);
router.get("/logout", logout);

module.exports = router;
