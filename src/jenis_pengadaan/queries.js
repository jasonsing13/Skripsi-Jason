const getJenis_Pengadaan = `SELECT jenis_pengadaan_id, nama_jenis_pengadaan, pengadaan_id
FROM public.jenis_pengadaan;`;
const getJenis_Pengadaan_Id= `select * from jenis_pengadaan where jenis_pengadaan = $1`;


module.exports = {
    getJenis_Pengadaan,
    getJenis_Pengadaan_Id,
};

