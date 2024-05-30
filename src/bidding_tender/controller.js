const db = require('../../database/db');
const queries = require('../bidding_tender/queries');

async function getBidding_Tender() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getBidding_Tender); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

//   async function getBidding() {
//     const client = await db.pool.connect();
//     try {
//         console.log('Executing query:', queries.getBidding); // Log query yang akan dijalankan
//         const result = await client.query(queries.getBidding);
//         console.log('Query result:', result.rows); // Log hasil query
//         return result.rows;
//     } catch (error) {
//         console.error('Error executing query', error.stack); // Log error yang lebih detail
//         throw error;
//     } finally {
//         client.release();
//     }
// }

async function getBidding() {
    const client = await db.pool.connect();
    try {
        console.log('Executing query:', queries.getBidding); // Log query yang akan dijalankan
        const result = await client.query(queries.getBidding);
        console.log('Query result:', result.rows); // Log hasil query
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error); // Log error yang lebih detail
        return null;
    } finally {
        client.release();
    }
}


async function getTender() {
    const client = await db.pool.connect();
    try {
        console.log('Executing query:', queries.getTender); // Log query yang akan dijalankan
        const result = await client.query(queries.getTender);
        console.log('Query result:', result.rows); // Log hasil query

        // Trim spasi berlebih dari hasil query
        // const trimmedResult = result.rows.map(row => {
        //     return {
        //         ...row,
        //         nama_pengadaan: row.nama_pengadaan.trim(),
        //         nama_item: row.nama_item.trim(),
        //         nama_jenis_pengadaan: row.nama_jenis_pengadaan.trim()
        //     };
        // });

        // console.log('Trimmed result:', trimmedResult); // Log hasil yang sudah di-trim
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error); // Log error yang lebih detail
        return null;
    } finally {
        client.release();
    }
}

async function getLinkZoom() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getBidding);
        return result.rows;
    } catch (error) {
        console.error('Error executing getBidding query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

const getBidding_TenderById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getBidding_TenderById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addBidding_Tender = (req,res)=>{
    const { bt_id, pengadaan_id, evaluasi_vendor, link_zoom } = req.body;
    pool.query(
        queries.addBidding_Tender,
        [bt_id, pengadaan_id, evaluasi_vendor, link_zoom],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("Bidding Tender created success")
        }
    );
};

const removeBidding_Tender = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeBidding_Tender, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Bidding Tender berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Bidding Tender tidak ditemukan');
        }
        

    });
};

const updateBidding_Tender = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateBidding_Tender, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan Bidding Tender berhasil");
    });
};


module.exports = {
    getBidding_Tender,
    getBidding,
    getTender,
    getLinkZoom,
    getBidding_TenderById,
    addBidding_Tender,
    removeBidding_Tender,
    updateBidding_Tender,
};

