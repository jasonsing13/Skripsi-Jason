const db = require('../../database/db');
const queries = require('../pengadaan/queries');


    async function getPengadaan() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getPengadaan); // Adjust the SQL query based on your actual table and data structure
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
  }

  async function option_Tipe_Pemilihan() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.option_Tipe_Pemilihan); // Adjust the SQL query based on your actual table and data structure
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
//         create_by,
//         modif_date,
//         modif_by
//     } = req.body;
//     const {id} = req.session;
//     console.log(req.body)
//     pool.query(
//         queries.addPengadaan_Insert_Jenis_Vendor,
//         [nama_jenis_vendor,], (error, results) => {
//             if (error) throw error;
//             res.status(201).send("Pengadaan created success")
//         }
//     );
//     pool.query(
//         queries.addPengadaan_Insert_Jenis_Pengadaan,
//         [nama_jenis_pengadaan,], (error, results) => {
//             if (error) throw error;
//             res.status(201).send("Pengadaan created success")
//         }
//     );
//     pool.query(
//         queries.addPengadaan_Insert_Item,
//         [nama_item, harga_item, jumlah_item], (error, results) => {
//             if (error) throw error;
//             res.status(201).send("Pengadaan created success")
//         }
//     );
// };


const addPengadaan = (req,res)=>{ 
    const {
        nama_pengadaan,
        tipe_pemilihan_id, 
        jenis_pengadaan_id, 
        jenis_vendor_id, 
        termin_pembayaran,
        tanggal_pemilihan, 
        create_date,
        create_by
    } = req.body;
    console.log(req.body)
    db.pool.query(
        queries.addPengadaan,
        [
            req.body.nama_pengadaan,
            req.body.tipe_pemilihan_id,
            req.body.jenis_pengadaan_id,
            req.body.jenis_vendor_id,
            req.body.termin_pembayaran,
            req.body.create_by,
        ], (error, results) => {
            console.log(results)
            if (error) console.log(error);
            else return results.rows[0].pengadaan_id;        
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

const validasiPengadaan = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateUser, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan pengadaan berhasil");
    });
};

module.exports = {
    getPengadaan,
    option_Tipe_Pemilihan,
    option_Jenis_Pengadaan,
    option_Jenis_Vendor,
    getPengadaanById,
    addPengadaan,
    removePengadaan,
    validasiPengadaan,
};

