const pool = require('../../database/db');
const queries = require('../vendor_score/queries');

const getVendor_Score = (req,res)=>{
    pool.query(queries.getVendor_Score, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getVendor_ScoreById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getVendor_ScoreById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addVendor_Score = (req,res)=>{
    const { vs_id, pengadaan_id, score_vendor, template_vs_id, vendor_id } = req.body;
    pool.query(
        queries.addUser,
        [vs_id, pengadaan_id, score_vendor, template_vs_id, vendor_id],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("vendor score created success")
        }
    );
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

