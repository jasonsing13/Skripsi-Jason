const pool = require('../../database/db');
const queries = require('../list_item/queries');

const getList_Item = (req,res)=>{
    pool.query(queries.getList_Item, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getList_ItemById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getList_ItemById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addList_Item = (req,res)=>{
    const { list_item_id, pengadaan_id, item_id, quantity, harga_total } = req.body;
    pool.query(
        queries.addList_Item,
        [list_item_id, pengadaan_id, item_id, quantity, harga_total],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("list item created success")
        }
    );
};

const removeList_Item = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeList_Item, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('List item berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('List item tidak ditemukan');
        }
        

    });
};

const updateList_Item = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateList_Item, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan List item berhasil");
    });
};


module.exports = {
    getList_Item,
    getList_ItemById,
    addList_Item,
    removeList_Item,
    updateList_Item,
};

