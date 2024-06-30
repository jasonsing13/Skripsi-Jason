const pool = require('../../database/db');
const queries = require('../vendor_score/queries');
const queriesV = require('../pengadaan/queries');
const contNotif = require('../notif/controller')

const getVendor_Score = async (pengadaan_id)=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getVendor_Score, [pengadaan_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const getVendor_ScoreById = async (pengadaan_id, vendor_id)=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getVendor_ScoreById, [pengadaan_id, vendor_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const addVendor_Score = async (pengadaan_id, vendor_id)=>{
    const client = await pool.pool.connect();
    try {
        await client.query(queries.addVendor_Score, [pengadaan_id, vendor_id]); // Adjust the SQL query based on your actual table and data structure
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const removeVendor_Score = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeVendor_Score, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Vendor Score berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Vendor SCore tidak ditemukan');
        }
        

    });
};

const updateVendor_Score = async (
    pengadaan_id, vendor_id,
    final_score, 
    bobot_teknikal, 
    bobot_komersil,
    desc_teknikal,
    desc_komersil,
    approve_division,
    approve_department,
    approve_presdir
    ) => {

    const client = await pool.pool.connect();
    try {
        if(bobot_teknikal){
            const result = await client.query(queries.updateVendor_Score, [pengadaan_id, vendor_id,
                final_score, 
                bobot_teknikal, 
                desc_teknikal]); // Adjust the SQL query based on your actual table and data structure
            return result.rows[0];
        }else if(bobot_komersil){
            const result = await client.query(queries.updateVendor_ScoreKomersil, [pengadaan_id, vendor_id,
                final_score, 
                bobot_komersil,
                desc_komersil]); // Adjust the SQL query based on your actual table and data structure
            return result.rows[0];
        }else if (approve_division){
            await client.query(queries.updateVendor_ScoreDiv, [pengadaan_id, vendor_id,
                approve_division]); // Adjust the SQL query based on your actual table and data structure
        } else if(approve_department){
            await client.query(queries.updateVendor_ScoreDep, [pengadaan_id, vendor_id,
                approve_department]); // Adjust the SQL query based on your actual table and data structure
        } else if(approve_presdir){
            await client.query(queries.updateVendor_ScoreP, [pengadaan_id, vendor_id,
                approve_presdir]); // Adjust the SQL query based on your actual table and data structure
        }

        const resultVS = await client.query(queries.getVendor_ScoreById, [pengadaan_id, vendor_id]);
        const resVS = resultVS.rows[0];
        if(resVS.approve_department && resVS.approve_division && resVS.approve_presdir){
            await client.query(queriesV.setPemenang, [vendor_id, pengadaan_id])

            const r_id = await client.query(queriesV.getPengadaanById, [pengadaan_id]);
            const nama_pengadaan = r_id.rows[0].nama_pengadaan;
            await contNotif.addNotif(vendor_id, `Selamat! Anda telah terpilih sebagai pemenang vendor scoring untuk pengadaan ${nama_pengadaan}. Silakan masuk ke Portal Vendor untuk detail lebih lanjut.`);
        }
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};


module.exports = {
    getVendor_Score,
    getVendor_ScoreById,
    addVendor_Score,
    removeVendor_Score,
    updateVendor_Score,
};

