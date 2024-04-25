const pool = require('../../database/db');
const queries = require('../user/queries');

const getUser = (req,res)=>{
    pool.query(queries.getUser, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getUserById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getUserById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addUser = (req,res)=>{
    const { user_id, username, password, email, first_name, last_name, phone_number, create_by, create_date, modif_by, modif_date, role_id } = req.body;
    pool.query(
        queries.addUser,
        [user_id, username, password, email, first_name, last_name, phone_number, create_by, create_date, modif_by, modif_date, role_id],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("user created success")
        }
    );
};

const removeUser = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeUser, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Pengguna berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Pengguna tidak ditemukan');
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

const updateUser = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateUser, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan pengguna berhasil");
    });
};


module.exports = {
    getUser,
    getUserById,
    addUser,
    removeUser,
    updateUser,
};

const getRole = (req,res)=>{
    pool.query(queries.getROle, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getRoleById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getRoleById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

module.exports = {
    getRole,
    getRoleById,
};

const getVendor = (req,res)=>{
    pool.query(queries.getVendor, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

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

const updateVendor = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateUser, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan pengguna berhasil");
    });
};


module.exports = {
    getVendor,
    getVendorById,
    addVendor,
    removeVendor,
    updateVendor,
};

const getPengadaan = (req,res)=>{
    pool.query(queries.getPengadaan, (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getPengadaanById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getPengadaanById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addPengadaan = (req,res)=>{
    const { pengadaan_id, tanggal_permintaan, tanggal_pemilihan, tanggal_pemilihan_selesai, harga, vendor_pemenang, status_id, tipe_pemilihan_id, validator_1, validator_2, validator_3, validator_4, create_date, create_by, modif_date, modif_by, pic, termin_pembayaran, catatan_revisi
    } = req.body;
    pool.query(
        queries.addPengadaan,
        [pengadaan_id, tanggal_permintaan, tanggal_pemilihan, tanggal_pemilihan_selesai, harga, vendor_pemenang, status_id, tipe_pemilihan_id, validator_1, validator_2, validator_3, validator_4, create_date, create_by, modif_date, modif_by, pic, termin_pembayaran, catatan_revisi        
        ], (error, results) => {
            if (error) throw error;
            res.status(201).send("user created success")
        }
    );
};

const removePengadaan = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removePengadaan, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Pengadaan berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Pengadaan tidak ditemukan');
        }
        

    });
};


const updatePengadaan = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateUser, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan pengadaan berhasil");
    });
};

module.exports = {
    getPengadaan,
    getPengadaanById,
    addPengadaan,
    removePengadaan,
    updatePengadaan,
};
