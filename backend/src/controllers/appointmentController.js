const appointmentService = require("../services/appointmentService");

class AppointmentController {
  async bookAppointment(req, res, next) {
    try {
      const appointment = await appointmentService.bookAppointment(req.supabase, req.body);
      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async getUserAppointments(req, res, next) {
    try {
      const appointments = await appointmentService.getUserAppointments(req.supabase, req.params.userId);
      res.json(appointments);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AppointmentController();
