const pool = require("./src/config/db");

async function test() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connected");
    console.log(result.rows[0]);
  } catch (err) {
    console.error("❌ Connection failed");
    console.error(err);
  }
}

test();