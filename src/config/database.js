const psql = require("pg");
const { Pool } = psql;

const db = new Pool({
  connectionString:process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const dbConn = async () => {
  const client = await db.connect();
  try {
    console.log("DB connected");
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }finally{
     client.release()
    
  }
};

module.exports = { db, dbConn };
