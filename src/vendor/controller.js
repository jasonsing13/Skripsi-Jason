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

  async function getProfilInformasi(vendor_id) {
    const client = await db.pool.connect();
    try {
      const result = await client.query(queries.getProfilInformasi, [vendor_id]);
      return result.rows[0]; // Asumsi Anda hanya mengambil satu baris data
    } catch (error) {
      console.error('Error executing query', error.stack);
      throw error;
    } finally {
      client.release();
    }
  }

  async function getProfilAkunBank(vendor_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getProfilAkunBank, [vendor_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

  async function getProfilPerpajakan(vendor_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getProfilPerpajakan, [vendor_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

  async function getProfilLegalitas(vendor_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getProfilLegalitas, [vendor_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

const getVendorById = (req,res)=>{
    const id = req.params.id;
    db.pool.query(queries.getVendorById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const addVendor = (req,res)=>{
    const {  
        nama_vendor,
        email_perusahaan,
        jenis_vendor_id,
        status_kantor,
        alamat_perusahaan,
        nama_direktur,
        no_telp,
        negara,
        provinsi_id,
        kk_id,
        create_by,
        create_date
    } = req.body;
    console.log( req.body);
    db.pool.query(
        queries.addVendor,
        [  
            req.body.nama_vendor,
            req.body.email_perusahaan,
            req.body.jenis_vendor_id,
            req.body.status_kantor,
            req.body.alamat_perusahaan,
            req.body.nama_direktur,
            req.body.no_telp,
            req.body.negara,
            req.body.provinsi_id,
            req.body.kk_id,
            req.body.create_by,
            req.body.create_date],
        (error, results) => {

            if (error) console.log(error);
            else return results.rows[0].vendor_id;
        }
    );
};

// const addAccount = (req,res)=>{
//     const {  
//         email_perusahaan,
//         password,
//     } = req.body;
//     console.log(req.body);
//     db.pool.query(
//         queries.addAccount,
//         [  
//             email_perusahaan,
//             password],
//         (error, results) => {

//             if (error) console.log(error);
//             else return results.rows[0].vendor_id;
//         }
//     );
// };


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

  
async function option_kategori_vendor() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_kategori_vendor); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }
  
async function option_Provinsi() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_Provinsi); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

  async function option_Kabupaten_Kota(provinsi_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_Kabupaten_Kota, [provinsi_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

  async function option_Bank() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_Bank); // Adjust the SQL query based on your actual table and data structure
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
    db.pool.query(queries.removeVendor, [id], (error, result)=>{
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


const addRekening_Vendor = (req, res) => {
    const { no_rekening, nama_pemilik_rekening, bank_id, vendor_id } = req.body;
    const queryParams = [no_rekening, nama_pemilik_rekening, bank_id, req.query.id];
    console.log(queryParams);
    db.pool.query(queries.addRekening_Vendor, queryParams)
        .then(result => {
            // Lakukan sesuatu jika query berhasil dieksekusi
            console.log("Tambah Rekening-Vendor berhasil");
            // Lanjutkan dengan mengupdate Rekening-Vendor
        db.pool.query(queries.updateRekening_Vendor, queryParams);
        })
        .then(result => {
            // Lakukan sesuatu jika query update berhasil dieksekusi
            console.log("Update Rekening-Vendor berhasil");
        })
        .catch(error => {
            // Tangani kesalahan di sini
            console.error("Terjadi kesalahan:", error);
        });
};

// const addRekening_Vendor = async (req, res) => {
//     const { no_rekening, nama_pemilik_rekening, bank_id } = req.body;
//     // const vendor_id = req.session.vendor_id;
//     const queryParams = [no_rekening, nama_pemilik_rekening, bank_id, vendor_id];
//     console.log(req.body);
//     try {
//         await db.pool.query(queries.addRekening_Vendor, queryParams);
//         console.log("Tambah Rekening-Vendor berhasil");

//         await db.pool.query(queries.updateRekening_Vendor, queryParams);
//         console.log("Update Rekening-Vendor berhasil");
//     } catch (error) {
//         console.error("Terjadi kesalahan:", error);
//     }
// };


const updateTax_Vendor = (req, res) => {
    const id = req.params.id;
    const { no_npwp, status_pkp, vendor_id} = req.body;
    const queryParams = [no_npwp, status_pkp, vendor_id];
    console.log(req.body);
    db.pool.query(queries.updateTax_Vendor, queryParams, (error, result) => {
        if (error) throw error;
    });
};

const updateLegal_Vendor = (req, res) => {
    const id = req.params.id;
    const { no_nibrba, no_ktp_direktur, vendor_id } = req.body;
    const queryParams = [id, no_nibrba, no_ktp_direktur, vendor_id];
    console.log(req.body);
    db.pool.query(queries.updateLegal_Vendor, queryParams, (error, result) => {
      if (error) throw error;
    });
  };
  

const updateVendorURL = (req, res) => {
    const id = req.params.id;
    const { url_ktp_direktur, url_nibrba, url_akta_pendirian, url_akta_perubahan, url_dokumen_ijin_lain, url_dokumen_npwp, url_buku_akun_bank, url_profil_perusahaan, vendor_id } = req.body;
    const queryParams = [url_ktp_direktur, url_nibrba, url_akta_pendirian, url_akta_perubahan, url_dokumen_ijin_lain, url_dokumen_npwp, url_buku_akun_bank, url_profil_perusahaan, req.query.id];
    console.log(req.body)
    db.pool.query(queries.updateVendorURL, queryParams, (error, result) => {
        if (error) throw error;
    });
};

const updateStatus_Vendor = (req, res) => {
    const id = req.params.id;
    const { status_id, vendor_id } = req.body;
    const queryParams = [status_id, vendor_id];
    console.log(req.body);
    db.pool.query(queries.updateStatus_Vendor, queryParams, (error, result) => {
      if (error) throw error;
    });
  };



module.exports = {
    getVendor,
    getProfilInformasi,
    getProfilAkunBank,
    getProfilPerpajakan,
    getProfilLegalitas,
    option_Jenis_Vendor,
    option_Provinsi,
    option_Kabupaten_Kota,
    option_Bank,
    getVendorById,
    addVendor,
    option_kategori_vendor,
    removeVendor,
    addRekening_Vendor,
    updateTax_Vendor,
    updateLegal_Vendor,
    updateVendorURL,
    updateStatus_Vendor
};

