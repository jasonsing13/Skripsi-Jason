const pool = require('../../database/db');
const queries = require('../detail_vs/queries');

const getDetail_Vs = async (vs_id)=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getDetail_Vs, [vs_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const getDetail_VsById = async (vs_id)=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getDetail_VsById, [vs_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const addDetail_Vs = async (vs_id, template_vs_id, score1, score2, type, user_id)=>{
    const client = await pool.pool.connect();
    try {
        await client.query(queries.addDetail_Vs, [vs_id, template_vs_id, score1, score2, type, user_id]); // Adjust the SQL query based on your actual table and data structure
        
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const removeDetail_Vs = async (vs_id, type)=>{
    const client = await pool.pool.connect();
    try {
        await client.query(queries.removeDetail_Vs, [vs_id, type]); // Adjust the SQL query based on your actual table and data structure
        
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const updateDetail_Vs = async (req, res) => {
    const client = await pool.pool.connect();
    try {
        await client.query(queries.updateDetail_Vs, [vs_id, type, template_vs_id, score1, score2, user_id]); // Adjust the SQL query based on your actual table and data structure
        
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};


module.exports = {
    getDetail_Vs,
    getDetail_VsById,
    addDetail_Vs,
    removeDetail_Vs,
    updateDetail_Vs,
};

