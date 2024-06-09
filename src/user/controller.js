const db = require('../../database/db');
const queries = require('../user/queries');

async function getUser() {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getUser);
        return result.rows; // Asumsi Anda hanya mengambil satu baris data
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

// const getUserById = (req,res)=>{
//     const id = req.params.id;
//     pool.query(queries.getUserById,[id], (error, results)=>{
//         if(error) throw error;
//         res.status(200).json(results.rows);
//     })
// };

async function getUserByEmail(email_perusahaan) {
    const client = await db.pool.connect();
    try {
        const result = await client.query(queries.getUserByEmail, [email_perusahaan]);
        return result.rows; // Asumsi Anda hanya mengambil satu baris data
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

// const addUser = (req,res)=>{
//     const { user_id, username, password, email, first_name, last_name, phone_number, create_by, create_date, modif_by, modif_date, role_id } = req.body;
//     pool.query(
//         queries.addUser,
//         [user_id, username, password, email, first_name, last_name, phone_number, create_by, create_date, modif_by, modif_date, role_id],
//         (error, results) => {
//             if (error) throw error;
//             res.status(201).send("user created success")
//         }
//     );
// };

// const removeUser = (req,res)=>{
//     const id = req.params.id;
//     pool.query(queries.removeUser, [id], (error, result)=>{
//         if (error) {
//             // Handle error
//             console.error('Error:', error);
//             res.status(500).send('Terjadi kesalahan pada server');
//             return;
//         }

//         if (result && result.rowCount > 0) {
//             // Jika ada baris yang terhapus, kirim respons berhasil
//             res.status(200).send('Pengguna berhasil dihapus');
//         } 
        
//         else {
//             // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
//             res.status(404).send('Pengguna tidak ditemukan');
//         }
        

//     });
// };

// const updateUser = (req,res)=>{
//     const id = req.params.id;
//     const {username} = req.body;
    
//     pool.query(queries.updateUser,[username,id],(error,result)=>{
//         if(error) throw error;
//         res.status(200).send("user update sukses");
//        });

// };

// const updateUser = (req, res) => {
//     const id = req.params.id;
//     const { username } = req.body;

//     pool.query(queries.updateUser, [username, id], (error, result) => {
//         if (error) throw error;
//         res.status(200).send("Pembaruan pengguna berhasil");
//     });
// };


module.exports = {
    getUser,
    // getUserById,
    getUserByEmail,
    // addUser,
    // removeUser,
    // updateUser,
};

