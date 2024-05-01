const pool = require('../../database/db');
const queries = require('../item_gr/queries');

const getItem_Gr = (req,res)=>{
    pool.query(queries.getItem_Gr, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getItem_GrById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getItem_GrById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addItem_Gr = (req,res)=>{
    const { item_gr_id, nama_item, jumlah_item, kondisi_item, url_foto_item_gr } = req.body;
    pool.query(
        queries.addItem_Gr,
        [item_gr_id, nama_item, jumlah_item, kondisi_item, url_foto_item_gr],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("item gr created success")
        }
    );
};

const removeItem_Gr = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeItem_Gr, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('item goods received berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('item goods received tidak ditemukan');
        }
        

    });
};

const updateItem_Gr= (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateItem_Gr, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan item goods received berhasil");
    });
};


module.exports = {
    getItem_Gr,
    getItem_GrById,
    addItem_Gr,
    removeItem_Gr,
    updateItem_Gr,
};

