const pool = require('../../database/db');
const queries = require('../dbidding_tender/queries');

const getBidding_Tender = (req,res)=>{
    pool.query(queries.getBidding_Tender, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

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
    getBidding_TenderById,
    addBidding_Tender,
    removeBidding_Tender,
    updateBidding_Tender,
};

