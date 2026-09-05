const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = (
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  ""
).replace(/\/rest\/v1\/?$/, "");
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase credentials. Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const createAuthClient = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return supabase;
  }
  
  const token = authHeader.split(" ")[1];
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: { Authorization: `Bearer ${token}` }
    }
  });
};

module.exports = { supabase, createAuthClient };
