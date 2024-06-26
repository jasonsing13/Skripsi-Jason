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

const getGoods_ReceivedByPengadaanId = async (pengadaan_id, vendor_id)=>{
    try {
        const result = await pool.pool.query(await queries.getGoods_ReceivedByPenagdaanId,[pengadaan_id, vendor_id])
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } 
};

const addGoods_Received = async (url_invoice, url_surat_jalan, pengadaan_id, create_by)=>{
    pool.pool.query(
        await queries.addGoods_Received,
        [pengadaan_id, url_invoice, url_surat_jalan, create_by]);
};

const addGoods_ReceivedItem = async (jumlah_barang, kondisi_barang, bukti_foto, tanggal_terima, deskripsi_barang, received_id)=>{
    pool.pool.query(
        await queries.addGoods_ReceivedItem,
        [jumlah_barang, kondisi_barang, bukti_foto, tanggal_terima, deskripsi_barang, received_id]);
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
    addGoods_ReceivedItem,
    removeGoods_Received,
    updateGoods_Received,
    getGoods_ReceivedByPengadaanId
};

