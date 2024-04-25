const pool = require('../../database/db');
const queries = require('../vendor/queries');

const getVendor = (req,res)=>{
    pool.query(queries.getVendor, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

module.exports = {
    getVendor,
};