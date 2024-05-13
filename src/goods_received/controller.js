const pool = require('../../database/db');
const queries = require('../goods_received/queries');

const getGoods_Received = (req,res)=>{
    pool.query(queries.getGoods_Received, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

async function option_Jenis_Vendor() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_Jenis_Vendor); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

const getGoods_ReceivedById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getGoods_ReceivedById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addGoods_Received = (req,res)=>{
    const { received_id, penerima, item_gr_id, pengadaan_id, url_invoice, url_surat_jalan, status_id, create_date, create_by, modif_date, modif_by } = req.body;
    pool.query(
        queries.addGoods_Received,
        [received_id, penerima, item_gr_id, pengadaan_id, url_invoice, url_surat_jalan, status_id, create_date, create_by, modif_date, modif_by],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("Goods received created success")
        }
    );
};

const removeGoods_Received = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeGoods_Received, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Goods Received berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Goods Received tidak ditemukan');
        }
        

    });
};

// const updateUser = (req,res)=>{
//     const id = req.params.id;
//     const {username} = req.body;
    
//     pool.query(queries.updateUser,[username,id],(error,result)=>{
//         if(error) throw error;
//         res.status(200).send("user update sukses");
//        });

// };

const updateGoods_Received = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateGoods_Received, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan Goods Received berhasil");
    });
};


module.exports = {
    getGoods_Received,
    option_Jenis_Vendor,
    getGoods_ReceivedById,
    addGoods_Received,
    removeGoods_Received,
    updateGoods_Received,
};

