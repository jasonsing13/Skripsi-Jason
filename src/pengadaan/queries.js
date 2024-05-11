const getPengadaan = `SELECT pengadaan.*, status.nama_status, jenis_pengadaan.nama_jenis_pengadaan
FROM pengadaan
INNER JOIN status ON pengadaan.status_id = status.status_id
INNER JOIN vendor ON pengadaan.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id;
`;
const getPengadaanById = `select * from pengadaan where pengadaan_id = $1`;

const addPengadaan_Insert_Jenis_Vendor = `
-- Insert into public.jenis_vendor
INSERT INTO jenis_vendor (nama_jenis_vendor)
VALUES ($1);`

const addPengadaan_Insert_Jenis_Pengadaan = `
-- Insert into public.jenis_pengadaan
INSERT INTO jenis_pengadaan (nama_jenis_pengadaan)
VALUES ($1);`

const addPengadaan_Insert_Item=`
-- Insert into public.item 
INSERT INTO item (nama_item, harga_item, jumlah_item)
VALUES ($1, $2, $3);`

const addPengadaan_Pengadaan=`
-- Insert into public.pengadaan
INSERT INTO pengadaan (nama_pengadaan, tanggal_pemilihan, tanggal_pemilihan_selesai, harga, termin_pembayaran)
VALUES 
    ($1, $2, $3, $4, $5);`

const removePengadaan = ` delete from pengadaan where pengadaan_id = $1 `;
const updatePengadaan = `update pengadaan set nama_pengadaan =$1 where pengadaan_id = $2 `;


module.exports = {
    getPengadaan,
    getPengadaanById,
    addPengadaan,
    removePengadaan,
    updatePengadaan,
};

