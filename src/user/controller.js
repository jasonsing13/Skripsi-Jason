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

