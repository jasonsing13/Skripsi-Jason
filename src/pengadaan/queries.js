const getPengadaan = `SELECT pengadaan.*, status.nama_status, jenis_pengadaan.nama_jenis_pengadaan
FROM pengadaan
INNER JOIN status ON pengadaan.status_id = status.status_id
INNER JOIN vendor ON pengadaan.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id;
`;

const option_Tipe_Pemilihan = `SELECT nama_tipe_pemilihan
FROM public.tipe_pemilihan
WHERE nama_tipe_pemilihan IN ('bidding', 'vendor_scoring');
`;

const option_Jenis_Pengadaan = `Select nama_jenis_pengadaan from jenis_pengadaan;
`;

const option_Jenis_Vendor = `SELECT nama_jenis_vendor
FROM public.jenis_vendor;
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


const removePengadaan = ` delete from pengadaan where pengadaan_id = $1 `;
const updatePengadaan = `update pengadaan set nama_pengadaan =$1 where pengadaan_id = $2 `;


module.exports = {
    getPengadaan,
    getPengadaanById,
    option_Tipe_Pemilihan,
    option_Jenis_Pengadaan,
    option_Jenis_Vendor,
    addPengadaan_Insert_Item,
    addPengadaan_Insert_Jenis_Pengadaan,
    addPengadaan_Insert_Jenis_Vendor,
    removePengadaan,
    updatePengadaan,
};

