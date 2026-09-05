const { createAuthClient } = require("../config/supabaseClient");

const authMiddleware = (req, res, next) => {
  // Attach a request-scoped Supabase client to the request object
  // If the request contains a Bearer token, this client will act as the user.
  // Otherwise, it acts as an anonymous client.
  req.supabase = createAuthClient(req);
  next();
};

module.exports = authMiddleware;
