const pool = require('../../database/db');
const queries = require('../role/queires');

const getRole = async ()=>{
    const results = await pool.pool.query(queries.getRole)
    return results.rows;
};

const getDetailRole = async ()=>{
    const results = await pool.pool.query(queries.getDetailRole)
    return results.rows;
};

const getDetailRoleByName = async (name)=>{
    const results = await pool.pool.query(queries.getDetailRoleByName, [name])
    return results.rows[0].id;
};

const addDetailRole = async (name)=>{
    const results = await pool.pool.query(queries.addDetailRole, [name])
    return results.rows[0].id;
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
    getDetailRole,
    getDetailRoleByName,
    addDetailRole
};

