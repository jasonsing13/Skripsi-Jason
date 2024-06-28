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

async function getItemAll() {
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getItemAll); // Adjust the SQL query based on your actual table and data structure
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
    const {nama_item, harga_item} = req.body;
    pool.pool.query(
        queries.addItem,
        [nama_item, harga_item],
        (error, results) => {
            if (error) throw error;
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
    getItemAll,
    addItem,
    removeItem,
    updateItem,
};

