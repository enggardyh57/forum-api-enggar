const { Pool } = require('pg');

const testConfig = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
};

const pool = process.env.NODE_ENV === 'test'
  ? new Pool(testConfig)
  : new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

module.exports = pool;