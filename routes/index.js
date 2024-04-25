var express = require('express');
var router = express.Router();
var db = require("../database/db")

/* GET home page. */
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM user');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
