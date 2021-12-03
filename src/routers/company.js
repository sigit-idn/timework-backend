const express = require("express");
const { authorize } = require("../utils/authorization");
const {
  addCompany,
  getCompany,
  getCompanies,
  editCompany,
  deleteCompany,
} = require("../controllers/company");

const router = express();

router.post(
  "/",
  // authorize("superadmin"),
  addCompany
);
router.get("/", authorize("creator"), getCompanies);
router.get("/:id", authorize("employee"), getCompany);
router.put("/:id", authorize("superadmin"), editCompany);
router.delete("/:id", authorize("superadmin"), deleteCompany);

module.exports = router;
