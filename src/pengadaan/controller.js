const session = require('express-session');
const db = require('../../database/db');
const queries = require('../pengadaan/queries');
const queriesDBT = require('../detail_bidding_tender/queries');
const queriesBT = require('../bidding_tender/queries');
const contNotif = require('../notif/controller');
const { v4: uuidv4 } = require('uuid');

async function getDaftarPengadaan(vendor_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getDaftarPengadaan, [vendor_id, vendor_id]); 
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function getTerbaik() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getTerbaik); 
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function getDaftarPengadaanByVendor(vendor_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getDaftarPengadaanByVendor, [vendor_id]); 
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function getDaftarPengadaanAdmin() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getDaftarPengadaanAdmin); 
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}
async function getDaftarPengadaanByStatus(status_id, vendor_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getDaftarPengadaanByStatus, [status_id, vendor_id]);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function getDaftarPengadaanAdminByStatus(status_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getDaftarPengadaanAdminByStatus, [status_id]);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function getInformasiPengadaan(pengadaan_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getInformasiPengadaan, [pengadaan_id]);
        return result.rows; // Mengembalikan satu baris hasil
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function getInformasiPengadaanPrevious(pengadaan_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getInformasiPengadaanPrevious, [pengadaan_id]);
        return result.rows[0]; // Mengembalikan satu baris hasil
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function getItemPengadaan(pengadaan_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getItemPengadaan, [pengadaan_id]);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function getInformasiPO(pengadaan_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getInformasiPO, [pengadaan_id]);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function getDokumenPO(pengadaan_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getDokumenPO, [pengadaan_id]);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function option_Select_Status() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_Select_Status);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}

async function option_Select_Status_Admin() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_Select_Status_Admin);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}


const getItem = async (req, res) => {
    const pengadaan_id = req.params.pengadaan_id;

    try {
        const client = await db.pool.connect();
        const result = await client.query(queries.getItem, [pengadaan_id]);
        client.release();
        
        res.render('item-pengadaan', { item: result.rows });
    } catch (error) {
        console.error('Error executing query:', error.stack);
        res.status(500).send('Internal Server Error');
    }
};

const getVendorPemenang = async (pengadaan_id) => {
    try {
        const result = await db.pool.query(await queries.getVendorPemenang, [pengadaan_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query:', error.stack);
        res.status(500).send('Internal Server Error');
    } 
};

    async function option_PIC() {
  const client = await db.pool.connect();
  try {
      const result = await client.query(queries.option_PIC); // Adjust the SQL query based on your actual table and data structure
      return result.rows;
  } catch (error) {
      console.error('Error executing query', error.stack);
      throw error;
  } finally {
      client.release();
  }
}

const update_PIC = (req, res) => {
    const id = req.params.id;
    const { pic, user_id} = req.body;
    const queryParams = [pic, user_id];
    db.pool.query(queries.update_PIC, queryParams, (error, result) => {
        if (error) throw error;
    });
};

const update_evaluasi = async (pengadaan_id, bukti_evaluasi) => {
    const queryParams = [bukti_evaluasi, pengadaan_id];
    db.pool.query(queries.update_evaluasi, queryParams, (error, result) => {
        if (error) throw error;
    });
};

async function option_Vendor() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_Vendor); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }


  async function option_Tipe_Pemilihan1() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_Tipe_Pemilihan1); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

  async function option_Tipe_Pemilihan2() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_Tipe_Pemilihan2); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

  async function option_Jenis_Pengadaan() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_Jenis_Pengadaan); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

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

const getPengadaanById = async (id)=>{
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getPengadaanById, [id]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

// const addPengadaan = (req,res)=>{ 
//     const {
//         nama_pengadaan,
//         tipe_pemilihan_id, 
//         jenis_pengadaan_id, 
//         jenis_vendor_id, 
//         termin_pembayaran,
//         tanggal_pemilihan, 
//         create_date,
//         create_by
//     } = req.body;
//     console.log(req.body)
//     db.pool.query(
//         queries.addPengadaan,
//         [
//             req.body.nama_pengadaan,
//             req.body.tipe_pemilihan_id,
//             req.body.jenis_pengadaan_id,
//             req.body.jenis_vendor_id,
//             req.body.termin_pembayaran,
//             req.body.create_by,
//         ], (error, results) => {
//             console.log(results)
//             if (error) console.log(error);
//             else return results.rows[0].pengadaan_id;        
//         }
//     );
// };

const addPengadaan = async (pengadaan, user_id) => {
    const {
        nama_pengadaan,
        tipe_pemilihan,
        jenis_pengadaan,
        jenis_vendor,
        termin_pembayaran,
        totalHarga
    } = pengadaan;

    const pengadaan_id = uuidv4(); // Generate a new UUID
    try {
        const client = await db.pool.connect();
        await client.query(queries.addPengadaan, [
            pengadaan_id,
            nama_pengadaan,
            tipe_pemilihan,
            jenis_pengadaan,
            jenis_vendor,
            termin_pembayaran,
            user_id,
            totalHarga
        ]);

        await contNotif.addNotif(true, `Pengadaan ${nama_pengadaan} berhasil dibuat!`);

        client.release();
        return pengadaan_id;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    }
};

const addItem = async (pengadaan_id, item) => {
    const {
        id,
        harga,
        jumlah
    } = item;

    try {
        const client = await db.pool.connect();
        await client.query(queries.addListItem, [
            id,
            pengadaan_id,
            jumlah,
            harga        
        ]);
        client.release();
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    }
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

const doValidator = async (pengadaan_id, role_id, user_id, type) => {
    // GET Validator
    const pengadaan = await getPengadaanById(pengadaan_id);
    var validator = '';
    if(type == 'is_validate'){
        validator = pengadaan.is_validate;
    
        if(!validator){
            const validator_db = await db.pool.query(queries.addValidator);
            validator = validator_db.rows[0].id
    
            await db.pool.query(queries.insertValidatorPengadaan, [validator, pengadaan_id])
        }
    }else{
        validator = pengadaan.is_set_pemenang;
    
        if(!validator){
            const validator_db = await db.pool.query(queries.addValidator);
            validator = validator_db.rows[0].id
    
            await db.pool.query(queries.insertValidatorPemenangPengadaan, [validator, pengadaan_id])
        }
    }

    switch (role_id) {
        // ADMIN DIVISI
        case '123e4567-e89b-12d3-a456-426614174001':
            await db.pool.query(queries.validateDivisi, [user_id, validator]);
            break;

        // ADMIN PURCHASING
        case '123e4567-e89b-12d3-a456-426614174002':
            await db.pool.query(queries.validatePurchasing, [user_id, validator]);
            break;

        // ADMIN Division Head
        case '123e4567-e89b-12d3-a456-426614174004':
            console.log("CUKI");
            await db.pool.query(queries.validateDivisiHead, [user_id, validator]);
            break;
    }
}

const checkValidator = async (pengadaan_id, type) => {
    // GET Validator
    const pengadaan = await getPengadaanById(pengadaan_id);
    var validator = '';
    if(type == 'is_validate'){
        validator = pengadaan.is_validate;
    
    }else{
        validator = pengadaan.is_set_pemenang;
    }

    const validator_db = await db.pool.query(queries.getValidatorByID, [validator]);
    const status = validator_db.rows[0].status;

    if(status == 1){
        return true;
    }

    return false;
}

const validasiPengadaan = async (reqa, vendor_id = null, link_zoom = null) => {
    const { tanggal_pemilihan, tanggal_pemilihan_selesai, pic, pengadaan_id, harga, aanwijzing, user_id, role_id } = reqa;
    var queryParams = [];
    try {

        // GET PENGADAAN
        const pengadaan_db = await getPengadaanById(pengadaan_id);
        const type_p = pengadaan_db.tipe_pemilihan_id ;
        // PENUNJUKAN LANGSUNG
        if(type_p  == 'a81c1ea8-2e4f-47f1-a963-38496490cd93'){
            queryParams = [tanggal_pemilihan || null, tanggal_pemilihan_selesai || null, pic || null, aanwijzing || null, vendor_id, pengadaan_id];
            await db.pool.query( queries.validasiPengadaanLangsung, queryParams, (error, result) => {
                if (error) throw error;
            });

            // GET BT ID
            const bt = await db.pool.query(queriesBT.getBidding_TenderDetailById, [pengadaan_id]); // Adjust the SQL query based on your actual table and data structure
            // return result.rows;
            const bt_id = bt.rows[0].bt_id

            // ADD BIDDING DETAIL
            const dbt = await db.pool.query( queriesDBT.addDetail_Bidding_Tender, [bt_id, vendor_id]);
            const dbt_id = dbt.rows[0].dbt_id ;

            // SET PEMENANG
            // Hitung selisih dalam milidetik
            const differenceInMilliseconds = parseInt(tanggal_pemilihan_selesai) - parseInt(tanggal_pemilihan);

            // Konversi milidetik ke hari
            const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

            await db.pool.query( queries.setPemenangTender, [vendor_id, pengadaan_id, harga, differenceInDays], (error, result) => {
                if (error) throw error;
            });

            await db.pool.query( queries.setPemenang, [pengadaan_id], (error, result) => {
                if (error) throw error;
            });
            
            await db.pool.query( queries.setPemenang2, [dbt_id], (error, result) => {
                if (error) throw error;
            });

            const p_res = await getPengadaanById(pengadaan_id);
            const nama_pengadaan = p_res.nama_pengadaan;
            await contNotif.addNotif(vendor_id, `Selamat! Anda telah terpilih sebagai pemenang penunjukan langsung untuk pengadaan ${nama_pengadaan}. Silakan masuk ke Portal Vendor untuk detail lebih lanjut.`);
        }
        // TENDER
        else if(type_p == 'b8649cf1-3da3-4258-8e2d-459e10b1b95f'){
            queryParams = [tanggal_pemilihan || null, tanggal_pemilihan_selesai || null, pic || null, aanwijzing || null, pengadaan_id];
            await db.pool.query( queries.validasiPengadaan, queryParams, (error, result) => {
                if (error) throw error;
            });
            await db.pool.query( queries.validasiPengadaanTender, [link_zoom, pengadaan_id], (error, result) => {
                if (error) throw error;
            });
        }else{
            queryParams = [tanggal_pemilihan || null, tanggal_pemilihan_selesai || null, pic || null, aanwijzing || null, pengadaan_id];
            await db.pool.query( queries.validasiPengadaan, queryParams, (error, result) => {
                if (error) throw error;
            });
        }

        await doValidator(pengadaan_id, role_id, user_id, 'is_validate');

        if(await checkValidator(pengadaan_id, 'is_validate')){
            await db.pool.query( queries.updateStatusValidate, [pengadaan_id]);
        }

        const p_res = await getPengadaanById(pengadaan_id);
        const nama_pengadaan = p_res.nama_pengadaan;

        await contNotif.addNotif(true, `Pengadaan ${nama_pengadaan} berhasil divalidasi!`);
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    }
};

async function setPemenang (pengadaan_id, role_id, user_id, vendor_id, dbt_id, bt_id, harga, durasi) {
    const client = await db.pool.connect();
    try {
        if(harga){
            await client.query(queries.updateHargaDurasiTender, [dbt_id, harga, durasi]); 
            await client.query(queries.setPemenangTender, [vendor_id, pengadaan_id, harga, durasi]); 
        }else{
            await client.query(queries.setTempPemenang, [vendor_id, pengadaan_id]); 
        }

        const r_id = await client.query(queries.getPengadaanById, [pengadaan_id]);
        const nama_pengadaan = r_id.rows[0].nama_pengadaan;

        if(r_id.rows[0].tipe_pemilihan_id == '8ef85b64-6d65-4b87-b5ee-5f06016b135c'){
            await contNotif.addNotif(vendor_id, `Selamat! Anda telah terpilih sebagai pemenang vendor scoring untuk pengadaan ${nama_pengadaan}. Silakan masuk ke Portal Vendor untuk detail lebih lanjut.`);
        }else{
            await doValidator(pengadaan_id, role_id, user_id, 'is_set_pemenang');

            if(await checkValidator(pengadaan_id, 'is_set_pemenang')){
                await client.query( queries.setPemenang, [pengadaan_id]);
                await client.query(queries.setPemenang2, [dbt_id]); 
                await client.query(queries.setDitolak, [bt_id, dbt_id]);
    
                await contNotif.addNotif(vendor_id, `Selamat! Anda telah terpilih sebagai pemenang ${harga ? 'tender' : 'bidding'} untuk pengadaan ${nama_pengadaan}. Silakan masuk ke Portal Vendor untuk detail lebih lanjut.`);
            }
        }

    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

async function tutup (pengadaan_id) {
    const client = await db.pool.connect();
    try {
        
        await client.query(queries.tutup, [pengadaan_id]); 

    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getTerbaik,
    getDaftarPengadaan,
    getDaftarPengadaanAdmin,
    getDaftarPengadaanByStatus,
    getDaftarPengadaanAdminByStatus,
    getDaftarPengadaanByVendor,
    getInformasiPengadaan,
    getInformasiPengadaanPrevious,
    getItemPengadaan,
    getInformasiPO,
    getDokumenPO,
    tutup,
    option_PIC,
    option_Select_Status,
    option_Select_Status_Admin,
    update_PIC,
    update_evaluasi,
    option_Vendor,
    option_Tipe_Pemilihan1,
    option_Tipe_Pemilihan2,
    option_Jenis_Pengadaan,
    option_Jenis_Vendor,
    getPengadaanById,
    addPengadaan,
    getItem,
    addItem,
    removePengadaan,
    validasiPengadaan,
    setPemenang,
    getVendorPemenang
};
