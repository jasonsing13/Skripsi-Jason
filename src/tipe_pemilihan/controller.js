const pool = require('../../database/db');
const queries = require('../tipe_pemilihan/queries');

const getTipe_Pemilihan= (req,res)=>{
    pool.query(queries.getTipe_Pemilihan, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getTipe_PemilihanById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getTipe_PemilihanById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

module.exports = {
    getTipe_Pemilihan,
    getTipe_PemilihanById,
};

