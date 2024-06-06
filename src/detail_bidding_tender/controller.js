const pool = require('../../database/db');
const queries = require('../detail_bidding_tender/queries');


async function getDetail_Bidding_Tender() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getDetail_Bidding_Tender); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

async function getDetail_Bidding_TenderById(id) {
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getDetail_Bidding_TenderById, [id]);
        return result.rows; // Asumsi Anda hanya mengambil satu baris data
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

// const addDetail_Bidding_Tender = (req,res)=>{
//     const { pengajuan_harga, durasi_pekerjaan } = req.body;
//     pool.query(
//         queries.addDetail_Bidding_Tender,
//         [pengajuan_harga, durasi_pekerjaan],
//         (error, results) => {
//             if (error) throw error;
//             res.status(201).send("Detail Bidding Tender created success")
//         }
//     );
// };

async function addDetail_Bidding_Tender(bt_id, vendor_id) {
    const client = await pool.pool.connect();
    try {
        await client.query(queries.addDetail_Bidding_Tender, [bt_id, vendor_id]);
    } catch (error) {
        console.error('Error executing query', error); // Log error yang lebih detail
        return null;
    } finally {
        client.release();
    }
}


const removeDetail_Bidding_Tender = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeDetail_Bidding_Tender, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Detail Bidding Tender berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Detail Bidding Tender tidak ditemukan');
        }
        

    });
};


async function updateDetail_Bidding_Tender(durasi_pekerjaan, pengajuan_harga, bt_id, vendor_id){
    const client = await pool.pool.connect();
    try {
        await client.query(queries.updateDetail_Bidding_Tender, [pengajuan_harga, durasi_pekerjaan, bt_id, vendor_id]);
    } catch (error) {
        console.error('Error executing query', error); // Log error yang lebih detail
        return null;
    } finally {
        client.release();
    }
};


module.exports = {
    getDetail_Bidding_Tender,
    getDetail_Bidding_TenderById,
    addDetail_Bidding_Tender,
    removeDetail_Bidding_Tender,
    updateDetail_Bidding_Tender,
};

