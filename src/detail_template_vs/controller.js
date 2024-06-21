const pool = require('../../database/db');
const queries = require('../detail_template_vs/queries');

const getDetail_Template_Vs = async (input)=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getDetail_Template_Vs, [input]); // Adjust the SQL query based on your actual table and data structure
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const getDetail_Template_VsById = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.getDetail_Template_VsById,[id], (error, results)=>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
};

const getDetail_Template_VsByName = async (input)=>{
    const client = await pool.pool.connect();
    try {
        const result = await client.query(queries.getDetail_Template_VsByName, [input]); // Adjust the SQL query based on your actual table and data structure
        console.log(result)
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

const addDetail_Template_Vs = (req,res)=>{
    const { dtemplate_vs_id, template_vs_id, vs_kriteria_id, bobot } = req.body;
    pool.query(
        queries.addDetail_Template_Vs,
        [dtemplate_vs_id, template_vs_id, vs_kriteria_id, bobot],
        (error, results) => {
            if (error) throw error;
            res.status(201).send("Detail Template  created success")
        }
    );
};

const removeDetail_Template_Vs = (req,res)=>{
    const id = req.params.id;
    pool.query(queries.removeDetail_Template_Vs, [id], (error, result)=>{
        if (error) {
            // Handle error
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan pada server');
            return;
        }

        if (result && result.rowCount > 0) {
            // Jika ada baris yang terhapus, kirim respons berhasil
            res.status(200).send('Detail Template Vendor Scoring berhasil dihapus');
        } 
        
        else {
            // Jika tidak ada baris yang terhapus, kirim pesan bahwa pengguna tidak ditemukan
            res.status(404).send('Detail Template Vendor Scoring tidak ditemukan');
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

const updateDetail_Template_Vs = (req, res) => {
    const id = req.params.id;
    const { username } = req.body;

    pool.query(queries.updateDetail_Template_Vs, [username, id], (error, result) => {
        if (error) throw error;
        res.status(200).send("Pembaruan Detail Template Vs berhasil");
    });
};


module.exports = {
    getDetail_Template_Vs,
    getDetail_Template_VsById,
    getDetail_Template_VsByName,
    addDetail_Template_Vs,
    removeDetail_Template_Vs,
    updateDetail_Template_Vs,
};

