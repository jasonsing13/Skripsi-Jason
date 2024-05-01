const pool = require('../../database/db');
const queries = require('../kriteria/queries');

const getKriteria = (req,res)=>{
    pool.query(queries.getKriteria, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getKriteriaById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getKriteriaById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

module.exports = {
    getKriteria,
    getKriteriaById,
};

