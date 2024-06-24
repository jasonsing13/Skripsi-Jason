const pool = require('../../database/db');
const queries = require('../template_vs/queries');

const getTemplate_Vs = async ()=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getTemplate_Vs); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const getTemplate_VsByName = async (input)=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getTemplate_VsByName, [input]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const addTemplate_Vs = async (nama, desc)=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.addTemplate_Vs, [nama, desc]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0].template_vs_id;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
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
    getTemplate_VsByName,
    addTemplate_Vs
};

