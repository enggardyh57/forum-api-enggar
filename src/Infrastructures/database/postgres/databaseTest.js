require('dotenv').config();
const pool = require('./pool');

const testDatabase = async () => {
  const result = await pool.query('SELECT NOW()');
  console.log(result.rows);
};

testDatabase();