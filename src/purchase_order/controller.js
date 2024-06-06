const pool = require('../../database/db');
const queries = require('../purchase_order/queries');

const getPurchase_Order = (req,res)=>{
    pool.query(queries.getPurchase_Order, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getPurchase_OrderById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getPurchase_OrderById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addPurchase_Order = (req, res) => {
    const { po_id, tanggal_po, pengadaan_id, tanggal_pengiriman, alamat_pengiriman, nama_vendor, subTotal, discount, ppn, biaya, total, divHead, vendorApproval } = req.body;
    pool.query(
        queries.addPurchase_Order,
        [po_id, tanggal_po, pengadaan_id, tanggal_pengiriman, alamat_pengiriman, nama_vendor, subTotal, discount, ppn, biaya, total, divHead, vendorApproval],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("Purchase Order created successfully");
        }
    );
};

const removePurchase_Order = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removePurchase_Order, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('PO berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('PO tidak ditemukan');
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

const updatePurchase_Order = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updatePurchase_Order, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan PO berhasil");
    });
};

module.exports = {
    getPurchase_Order,
    getPurchase_OrderById,
    addPurchase_Order,
    removePurchase_Order,
    updatePurchase_Order,
};
