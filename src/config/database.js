const psql = require("pg");
const { Pool } = psql;

const db = new Pool({
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_DATABASE,
  // password: process.env.DB_PASS,
  // port: process.env.DB_PORT,

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
