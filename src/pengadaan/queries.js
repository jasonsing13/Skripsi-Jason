const getPengadaan = `SELECT pengadaan.*, status.nama_status, vendor.jenis_pengadaan
FROM pengadaan
INNER JOIN status ON pengadaan.status_id = status.status_id
INNER JOIN vendor ON pengadaan.vendor_id = vendor.vendor_id;
`;
const getPengadaanById = `select * from pengadaan where pengadaan_id = $1`;
const addPengadaan = `insert into pengadaan (pengadaan_id, tanggal_permintaan, tanggal_pemilihan, tanggal_pemilihan_selesai, harga, vendor_pemenang, status_id, tipe_pemilihan_id, validator_1, validator_2, validator_3, validator_4, create_date, create_by, modif_date, modif_by, pic, termin_pembayaran, catatan_revisi, nama_pengadaan)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32);`
const removePengadaan = ` delete from pengadaan where pengadaan_id = $1 `;
const updatePengadaan = `update pengadaan set nama_pengadaan =$1 where pengadaan_id = $2 `;


module.exports = {
    getPengadaan,
    getPengadaanById,
    addPengadaan,
    removePengadaan,
    updatePengadaan,
};

