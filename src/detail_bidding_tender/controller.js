const pool = require('../../database/db');
const queries = require('../detail_bidding_tender/queries');

const getDetail_Bidding_Tender = (req,res)=>{
    pool.query(queries.getDetail_Bidding_Tender, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getDetail_Bidding_TenderById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getDetail_Bidding_TenderById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addDetail_Bidding_Tender = (req,res)=>{
    const { dbt_id, pengajuan_harga, vendor_id, bt_id } = req.body;
    pool.query(
        queries.addDetail_Bidding_Tender,
        [dbt_id, pengajuan_harga, vendor_id, bt_id],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("Detail Bidding Tender created success")
        }
    );
};

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

// const updateUser = (req,res)=>{
//     const id = req.params.id;
//     const {username} = req.body;
    
//     pool.query(queries.updateUser,[username,id],(error,result)=>{
//         if(error) throw error;
//         res.status(200).send("user update sukses");
//        });

// };

const updateDetail_Bidding_Tender = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateDetail_Bidding_Tender, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan Detail Bidding Tender berhasil");
    });
};


module.exports = {
    getDetail_Bidding_Tender,
    getDetail_Bidding_TenderById,
    addDetail_Bidding_Tender,
    removeDetail_Bidding_Tender,
    updateDetail_Bidding_Tender,
};

