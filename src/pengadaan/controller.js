const pool = require('../../database/db');
const queries = require('../pengadaan/queries');


const getPengadaan = (req,res)=>{
    pool.query(queries.getPengadaan, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getPengadaanById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getPengadaanById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addPengadaan = (req,res)=>{
    const { pengadaan_id, tanggal_permintaan, tanggal_pemilihan, tanggal_pemilihan_selesai, harga, vendor_pemenang, status_id, tipe_pemilihan_id, validator_1, validator_2, validator_3, validator_4, create_date, create_by, modif_date, modif_by, pic, termin_pembayaran, catatan_revisi
    } = req.body;
    pool.query(
        queries.addPengadaan,
        [pengadaan_id, tanggal_permintaan, tanggal_pemilihan, tanggal_pemilihan_selesai, harga, vendor_pemenang, status_id, tipe_pemilihan_id, validator_1, validator_2, validator_3, validator_4, create_date, create_by, modif_date, modif_by, pic, termin_pembayaran, catatan_revisi        
        ], (error, results) => {
            if (error) throw error;
            res.status(201).send("user created success")
        }
    );
};

const removePengadaan = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removePengadaan, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Pengadaan berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Pengadaan tidak ditemukan');
        }
        

    });
};


const updatePengadaan = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateUser, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan pengadaan berhasil");
    });
};

module.exports = {
    getPengadaan,
    getPengadaanById,
    addPengadaan,
    removePengadaan,
    updatePengadaan,
};


