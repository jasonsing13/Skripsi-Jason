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
    const { vendor_id, nama_vendor, no_telp, nama_direktur, status_kantor, jenis_pengadaan, no_rek, username, password, email_perusahaan, alamat_perusahaan, url_ktp_direktur, url_ktp_penerima_kuasa, url_nibrba, url_akta_pendirian, url_akta_perubahan, url_dokumen_ijin_lain, url_dokumen_npwp, url_buku_akun_bank, create_date, create_by, modif_date, modif_by, negara, provinsi, kabupaten_kota, nama_bank, nama_pemilik_rekening, no_npwp, no_kpt_penerima_kuasa, url_profil_perusahaan
    } = req.body;
    pool.query(
        queries.addVendor,
        [ vendor_id, nama_vendor, no_telp, nama_direktur, status_kantor, jenis_pengadaan, no_rek, username, password, email_perusahaan, alamat_perusahaan, url_ktp_direktur, url_ktp_penerima_kuasa, url_nibrba, url_akta_pendirian, url_akta_perubahan, url_dokumen_ijin_lain, url_dokumen_npwp, url_buku_akun_bank, create_date, create_by, modif_date, modif_by, negara, provinsi, kabupaten_kota, nama_bank, nama_pemilik_rekening, no_npwp, no_kpt_penerima_kuasa, url_profil_perusahaan],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("Vendor created success")
        }
    );
};

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

// const updateVendor = (req, res) => {
//     const id = req.params.id;
//     const { username } = req.body;

//     pool.query(queries.updateVendor, [username, id], (error, result) => {
//         if (error) throw error;
//         res.status(200).send("Pembaruan vendor berhasil");
//     });
// };

const updateVendor = (req, res) => {
    const id = req.params.id;
    const { 
        nama_vendor, 
        no_telp, 
        nama_direktur, 
        status_kantor, 
        jenis_pengadaan, 
        no_rek, 
        username, 
        password, 
        email_perusahaan, 
        alamat_perusahaan, 
        url_ktp_direktur, 
        url_ktp_penerima_kuasa, 
        url_nibrba, 
        url_akta_pendirian, 
        url_akta_perubahan, 
        url_dokumen_ijin_lain, 
        url_dokumen_npwp, 
        url_buku_akun_bank, 
        create_date, 
        create_by, 
        modif_date, 
        modif_by, 
        negara, 
        provinsi, 
        kabupaten_kota, 
        nama_bank, 
        nama_pemilik_rekening, 
        no_npwp, 
        no_kpt_penerima_kuasa, 
        url_profil_perusahaan 
    } = req.body;

    const queryParams = [
        id, 
        nama_vendor, 
        no_telp, 
        nama_direktur, 
        status_kantor, 
        jenis_pengadaan, 
        no_rek, 
        username, 
        password, 
        email_perusahaan, 
        alamat_perusahaan, 
        url_ktp_direktur, 
        url_ktp_penerima_kuasa, 
        url_nibrba, 
        url_akta_pendirian, 
        url_akta_perubahan, 
        url_dokumen_ijin_lain, 
        url_dokumen_npwp, 
        url_buku_akun_bank, 
        create_date, 
        create_by, 
        modif_date, 
        modif_by, 
        negara, 
        provinsi, 
        kabupaten_kota, 
        nama_bank, 
        nama_pemilik_rekening, 
        no_npwp, 
        no_kpt_penerima_kuasa, 
        url_profil_perusahaan
    ];

    pool.query(queries.updateVendor, queryParams, (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan vendor berhasil");
    });
};



module.exports = {
    getVendor,
    getVendorById,
    addVendor,
    removeVendor,
    updateVendor,
};

