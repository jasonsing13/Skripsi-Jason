const pool = require('../../database/db');
const queries = require('../user/queries');

const getRole = (req,res)=>{
    pool.query(queries.getROle, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getRoleById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getRoleById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

module.exports = {
    getRole,
    getRoleById,
};

