const db = require('../../database/db');
const queries = require('../vendor/queries');

async function getVendor(nama) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getVendor, [nama]); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

async function getListVendor() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getListVendor); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

  async function getEmail(email_perusahaan) {
    const client = await db.pool.connect();
    try {
      const result = await client.query(queries.getEmail, [email_perusahaan]);
      return result.rows; // Asumsi Anda hanya mengambil satu baris data
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

  async function getApprovedVendorProfile(vendor_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getApprovedVendorProfile, [vendor_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

  async function getApprovedAkunBank(vendor_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getApprovedAkunBank, [vendor_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

  async function getApprovedAkunPerpajakan(vendor_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getApprovedAkunPerpajakan, [vendor_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

  async function getApprovedLegalitas(vendor_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getApprovedLegalitas, [vendor_id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

const getVendorById = async (id)=>{
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getVendorById, [id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

// const addVendor = (req,res)=>{
//     const {  
//         nama_vendor,
//         email_perusahaan,
//         jenis_vendor_id,
//         status_kantor,
//         alamat_perusahaan,
//         nama_direktur,
//         no_telp,
//         negara,
//         provinsi_id,
//         kk_id,
//         create_by,
//         create_date
//     } = req.body;
//     console.log( req.body);
//     db.pool.query(
//         queries.addVendor,
//         [  
//             req.body.nama_vendor,
//             req.body.email_perusahaan,
//             req.body.jenis_vendor_id,
//             req.body.status_kantor,
//             req.body.alamat_perusahaan,
//             req.body.nama_direktur,
//             req.body.no_telp,
//             req.body.negara,
//             req.body.provinsi_id,
//             req.body.kk_id,
//             req.body.create_by,
//             req.body.create_date],
//         (error, results) => {

//             if (error) console.log(error);
//             else return results.rows[0].vendor_id;
//         }
//     );
// };


const addVendor = (req, res) => {
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
        create_by
    } = req.body;

    return db.pool.query(
        queries.addVendor,
        [  
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
            create_by
        ]
    ).then(results => {
        if (results.rows.length > 0) {
            return results.rows[0].vendor_id;
        } else {
            throw new Error('Vendor ID not generated');
        }
    }).catch(error => {
        console.error('Error executing query', error.stack);
        throw error;
    });
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
    const { no_npwp, status_pkp, vendor_id } = req.body;
    const queryParams = [no_npwp, status_pkp, vendor_id];
    db.pool.query(queries.updateTax_Vendor, queryParams, (error, result) => {
      if (error) throw error;
    });
  };
  
  const updateLegal_Vendor = (req, res) => {
    const { no_nibrba, no_ktp_direktur, vendor_id } = req.body;
    const queryParams = [no_nibrba, no_ktp_direktur, vendor_id];
    db.pool.query(queries.updateLegal_Vendor, queryParams, (error, result) => {
      if (error) throw error;
    });
  };

async function updateVendorURL(id, url_type, url) {
    const client = await db.pool.connect();
    try {
        switch(url_type){
            case 'url_ktp_direktur':
                await client.query(queries.update_url_ktp_direktur, [id, url]); // Adjust the SQL query based on your actual table and data structure
                break;
            case 'url_ktp_penerima_kuasa':
                await client.query(queries.update_url_ktp_penerima_kuasa, [id, url]); // Adjust the SQL query based on your actual table and data structure
                break;
            case 'url_nirlaba':
                await client.query(queries.update_url_nibrba, [id, url]); // Adjust the SQL query based on your actual table and data structure
                break;
            case 'url_akta_pendirian':
                await client.query(queries.update_url_akta_pendirian, [id, url]); // Adjust the SQL query based on your actual table and data structure
                break;
            case 'url_akta_perubahan':
                await client.query(queries.update_url_akta_perubahan, [id, url]); // Adjust the SQL query based on your actual table and data structure
                break;
            case 'url_dokumen_ijin_lain':
                await client.query(queries.update_url_dokumen_ijin_lain, [id, url]); // Adjust the SQL query based on your actual table and data structure
                break;
            case 'url_dokumen_npwp':
                await client.query(queries.update_url_dokumen_npwp, [id, url]); // Adjust the SQL query based on your actual table and data structure
                break;
            case 'url_buku_akun_bank':
                await client.query(queries.update_url_buku_akun_bank, [id, url]); // Adjust the SQL query based on your actual table and data structure
                break;
            case 'url_profil_perusahaan':
                await client.query(queries.update_url_profil_perusahaan, [id, url]); // Adjust the SQL query based on your actual table and data structure
                break;
            case 'url_dokumen_ppkp':
                await client.query(queries.update_url_dokumen_ppkp, [id, url]); // Adjust the SQL query based on your actual table and data structure
                break;

        }
        return true;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function updateStatus_Vendor (id, status) {
    const client = await db.pool.connect();
    try {
        const queryParams = [status, id];
        client.query(queries.updateStatus_Vendor, queryParams, (error, result) => {
            if (error) throw error;
        });
        return true;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}


module.exports = {
    getVendor,
    getEmail,
    getProfilInformasi,
    getProfilAkunBank,
    getProfilPerpajakan,
    getProfilLegalitas,
    getApprovedVendorProfile,
    getApprovedAkunBank,
    getApprovedAkunPerpajakan,
    getApprovedLegalitas,
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
    updateStatus_Vendor,
    getListVendor
};

