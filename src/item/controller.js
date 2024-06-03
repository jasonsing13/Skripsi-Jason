const pool = require('../../database/db');
const queries = require('../item/queries');

async function getItem(prod) {
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getItem, [prod]); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

const getItemById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getItemById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addItem = (req,res)=>{
    const {item_id, nama_item, jumlah_item, harga_item, url_foto_item } = req.body;
    pool.query(
        queries.addItem,
        [item_id, nama_item, jumlah_item, harga_item, url_foto_item],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("user created success")
        }
    );
};

const removeItem = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeItem, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Item berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Item tidak ditemukan');
        }
        

    });
};

const updateItem = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateItem, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan item berhasil");
    });
};


module.exports = {
    getItem,
    getItemById,
    addItem,
    removeItem,
    updateItem,
};

