const pool = require('../../database/db');
const queries = require('../status/queries');

const getStatus = (req,res)=>{
    pool.query(queries.getStatus, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getStatusById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getStatusById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

module.exports = {
    getStatus,
    getStatusById,
};

