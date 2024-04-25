const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  password: 'admin',
  host: 'localhost', 
  port: 5432, // default Postgres port
  database: 'DB_Portal_Vendor'
});

module.exports = pool;

// pool.on('connect', () => {
//   console.log('Connected to the 2 database');
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params)
// };

