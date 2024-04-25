var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM user');
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
