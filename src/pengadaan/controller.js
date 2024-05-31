const db = require('../../database/db');
const queries = require('../pengadaan/queries');
const { v4: uuidv4 } = require('uuid');

async function getDaftarPengadaan() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getDaftarPengadaan); 
        console.log('Query result:', result.rows); // Debugging
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
}
async function getDaftarPengadaanByStatus(status_id) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getDaftarPengadaanByStatus, [status_id]);
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
        const result = await client.query(getInformasiPengadaanPrevious, [pengadaan_id]);
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
    console.log(req.body);
    db.pool.query(queries.update_PIC, queryParams, (error, result) => {
        if (error) throw error;
    });
};

async function option_Vendor(vendor_id) {
    const client = await db.pool.connect();
    console.log(client);
    try {
        const result = await client.query(queries.option_Vendor, [vendor_id]); // Adjust the SQL query based on your actual table and data structure
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

const getPengadaanById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getPengadaanById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
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

const addPengadaan = async (req, res) => {
    const {
        nama_pengadaan,
        tipe_pemilihan_id,
        jenis_pengadaan_id,
        jenis_vendor_id,
        termin_pembayaran,
        create_date,
        create_by
    } = req.body;

    const pengadaan_id = uuidv4(); // Generate a new UUID

    try {
        const client = await db.pool.connect();
        await client.query(queries.addPengadaan, [
            pengadaan_id,
            nama_pengadaan,
            tipe_pemilihan_id,
            jenis_pengadaan_id,
            jenis_vendor_id,
            termin_pembayaran,
            create_date,
            create_by,
        ]);
        client.release();
        return pengadaan_id;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    }
};

const addItem = async (pengadaan_id, item) => {
    const {
        nama_item,
        harga_item,
        jumlah_item,
    } = item;

    const item_id = uuidv4(); // Generate a new UUID for the item

    try {
        const client = await db.pool.connect();
        await client.query(queries.addItem, [
            item_id,
            nama_item,
            harga_item,
            jumlah_item,
            pengadaan_id        ]);
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

const validasiPengadaan = (req, res) => {
    const id = req.params.id;
    const { tipe_pemilihan_id, tanggal_pemilihan, tanggal_pemilihan_selesai, pic, vendor_id } = req.body;
    const queryParams = [tipe_pemilihan_id, tanggal_pemilihan, tanggal_pemilihan_selesai, pic, vendor_id, id];
    console.log(queryParams);
    db.pool.query(queries.validasiPengadaan, queryParams, (error, result) => {
        if (error) throw error;
    });
};

module.exports = {
    getDaftarPengadaan,
    getDaftarPengadaanByStatus,
    getInformasiPengadaan,
    getInformasiPengadaanPrevious,
    getItemPengadaan,
    getInformasiPO,
    getDokumenPO,
    option_PIC,
    option_Select_Status,
    update_PIC,
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
};
