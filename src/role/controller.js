const pool = require('../../database/db');
const queries = require('../role/queires');

const getRole = async ()=>{
    const results = await pool.pool.query(queries.getRole)
    return results.rows;
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

