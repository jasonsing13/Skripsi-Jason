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

const updateStatus = (req, res) => {
    const { vendorId, status } = req.body;
    const query = 'UPDATE vendors SET status = $1 WHERE id = $2';
    const values = [status, vendorId];
    pool.query(query, values, (error, results) => {
        if (error) throw error;
        res.redirect('/list-vendor-admin'); // Redirect after updating
    });
};


module.exports = {
    getStatus,
    getStatusById,
    updateStatus,
};

