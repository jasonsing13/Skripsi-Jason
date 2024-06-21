const pool = require('../../database/db');
const queries = require('../vendor_score/queries');

const getVendor_Score = async (pengadaan_id)=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getVendor_Score, [pengadaan_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const getVendor_ScoreById = async (pengadaan_id, vendor_id)=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getVendor_ScoreById, [pengadaan_id, vendor_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const addVendor_Score = async (pengadaan_id, vendor_id)=>{
    const client = await pool.pool.connect();
    try {
        await client.query(queries.addVendor_Score, [pengadaan_id, vendor_id]); // Adjust the SQL query based on your actual table and data structure
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const removeVendor_Score = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeVendor_Score, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Vendor Score berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Vendor SCore tidak ditemukan');
        }
        

    });
};

const updateVendor_Score = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateUser, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan pengguna berhasil");
    });
};


module.exports = {
    getVendor_Score,
    getVendor_ScoreById,
    addVendor_Score,
    removeVendor_Score,
    updateVendor_Score,
};

