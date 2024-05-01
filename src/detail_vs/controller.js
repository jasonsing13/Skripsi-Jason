const pool = require('../../database/db');
const queries = require('../detail_vs/queries');

const getDetail_Vs = (req,res)=>{
    pool.query(queries.getDetail_Vs, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getDetail_VsById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getDetail_VsById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addDetail_Vs = (req,res)=>{
    const { detail_vs_id, vs_id, template_vs_id, score, deskripsi_sub_kriteria, bobot } = req.body;
    pool.query(
        queries.addDetail_Vs,
        [detail_vs_id, vs_id, template_vs_id, score, deskripsi_sub_kriteria, bobot],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("detail vendor scoring created success")
        }
    );
};

const removeDetail_Vs = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeDetail_Vs, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Detail vendor scoring berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Detail vendor scoring tidak ditemukan');
        }
        

    });
};

const updateDetail_Vs = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateDetail_Vs, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan Detail vendor scoring berhasil");
    });
};


module.exports = {
    getDetail_Vs,
    getDetail_VsById,
    addDetail_Vs,
    removeDetail_Vs,
    updateDetail_Vs,
};

