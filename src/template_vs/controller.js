const pool = require('../../database/db');
const queries = require('../template_vs/queries');

const getTemplate_Vs = (req,res)=>{
    pool.query(queries.getTemplate_Vs, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getTemplate_VsById= (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getTemplate_VsById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

module.exports = {
    getTemplate_Vs,
    getTemplate_VsById,
};

