const db = require('../../database/db');
const queries = require('../jenis_vendor/queries');


async function getJenis_Vendor() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getJenis_Vendor); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

const getJenis_VendorById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getJenis_VendorById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};


module.exports = {
    getPengadaan,
    getPengadaanById,
    addPengadaan,
    removePengadaan,
    updatePengadaan,
};

