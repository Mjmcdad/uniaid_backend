const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentController");

router.post("/", studentController.createStudent);
router.post("/login", studentController.login);
router.post("/enrollment", studentController.createEnrollment);
router.put("/enrollment/:id", studentController.updateEnrollment);
router.get("/:id", studentController.get);
router.get("/:id/enrollment", studentController.getEnrollments);
router.get("/", studentController.index);
router.get("/:id/life", studentController.getAcadamicLife);
router.patch("/:id", studentController.updateStudent);
router.post("/password_reset_request", studentController.requestPasswordReset);
router.post("/password_reset", studentController.verifyOTPAndResetPassword);
module.exports = router;