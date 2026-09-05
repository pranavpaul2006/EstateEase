class AppointmentService {
  async bookAppointment(supabase, appointmentData) {
    const { data, error } = await supabase
      .from("appointments")
      .insert([appointmentData])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async getUserAppointments(supabase, userId) {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        properties ( title, price, location, property_images ( image_url, is_primary ) )
      `)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteAppointment(supabase, appointmentId) {
    const { data, error } = await supabase
      .from("appointments")
      .delete()
      .eq("appointment_id", appointmentId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = new AppointmentService();
