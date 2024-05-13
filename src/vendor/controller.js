const db = require('../../database/db');
const queries = require('../vendor/queries');

async function getVendor() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getVendor); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

const getVendorById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getVendorById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addVendor = (req,res)=>{
    const {  nama_vendor, email_perusahaan, status_kantor, alamat_perusahaan, nama_direktur, no_telp, negara,provinsi, kabupaten_kota, create_date, create_by
    } = req.body;
    pool.query(
        queries.addVendor,
        [nama_vendor, email_perusahaan, status_kantor, alamat_perusahaan, nama_direktur, no_telp, negara,provinsi, kabupaten_kota, create_date, create_by
        ],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("Vendor created success")
        }
    );
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

const removeVendor = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeVendor, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Vendor berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Vendor tidak ditemukan');
        }
        

    });
};


const updateVendor1 = (req, res) => {
    const id = req.params.id;
    const {   nama_bank, nama_pemilik_rekening, no_rek } = req.body;
    const queryParams = [id, nama_bank, nama_pemilik_rekening, no_rek];

    pool.query(queries.updateVendor1, queryParams, (error, result) => {
        if (error) throw error;
        res.status(200).send("Akun bank updated successfully");
    });
};

const updateVendor2 = (req, res) => {
    const id = req.params.id;
    const { no_npwp } = req.body;
    const queryParams = [id, no_npwp];

    pool.query(queries.updateVendor2, queryParams, (error, result) => {
        if (error) throw error;
        res.status(200).send("Akun perpajakan updated successfully");
    });
};

const updateVendor4 = (req, res) => {
    const id = req.params.id;
    const { url_ktp_direktur, url_nibrba, url_akta_pendirian, url_akta_perubahan, url_dokumen_ijin_lain, url_dokumen_npwp, url_buku_akun_bank, url_profil_perusahaan } = req.body;
    const queryParams = [url_ktp_direktur, url_nibrba, url_akta_pendirian, url_akta_perubahan, url_dokumen_ijin_lain, url_dokumen_npwp, url_buku_akun_bank, url_profil_perusahaan];

    pool.query(queries.updateVendor4, queryParams, (error, result) => {
        if (error) throw error;
        res.status(200).send("Vendor director details updated successfully");
    });
};

const updateVendor3 = (req, res) => {
    const id = req.params.id;
    const { no_nibrba, no_ktp_direktur } = req.body;
    const queryParams = [id, no_nibrba, no_ktp_direktur];

    pool.query(queries.updateVendor3, queryParams, (error, result) => {
        if (error) throw error;
        res.status(200).send("Vendor procurement and office status updated successfully");
    });
};


module.exports = {
    getVendor,
    option_Jenis_Vendor,
    getVendorById,
    addVendor,
    removeVendor,
    updateVendor1,
    updateVendor2,
    updateVendor3,
    updateVendor4
};

