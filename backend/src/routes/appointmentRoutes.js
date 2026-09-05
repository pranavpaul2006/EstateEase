const express = require("express");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

router.post("/", appointmentController.bookAppointment);
router.get("/user/:userId", appointmentController.getUserAppointments);
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
