const pool = require('../../database/db');
const queries = require('../kriteria/queries');

const getKriteria = (req,res)=>{
    pool.query(queries.getKriteria, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getKriteriaById = async (id)=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getKriteriaById, [id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getKriteria,
    getKriteriaById,
};

