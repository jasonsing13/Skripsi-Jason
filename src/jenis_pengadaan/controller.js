const db = require('../../database/db');
const queries = require('../jenis_pengadaan/queries');


async function getJenis_Pengadaan() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getJenis_Pengadaan); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

const getJenis_Pengadaan_Id = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getJenis_Pengadaan_Id,[id], (error, results)=>{
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

