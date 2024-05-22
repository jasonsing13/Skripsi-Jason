const getPengadaan = `SELECT pengadaan.*, status.nama_status, jenis_pengadaan.nama_jenis_pengadaan, jenis_vendor.nama_jenis_vendor
FROM pengadaan
INNER JOIN status ON pengadaan.status_id = status.status_id
INNER JOIN jenis_pengadaan ON pengadaan.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
INNER JOIN jenis_vendor ON pengadaan.jenis_vendor_id = jenis_vendor.jenis_vendor_id;
`;

const option_Tipe_Pemilihan = `SELECT tipe_pemilihan_id, nama_tipe_pemilihan
FROM public.tipe_pemilihan
WHERE nama_tipe_pemilihan IN ('penunjukkan_langsung', 'vendor_scoring');
`;

const option_Jenis_Pengadaan = `Select jenis_pengadaan_id, nama_jenis_pengadaan from jenis_pengadaan;
`;

const option_Jenis_Vendor = `SELECT jenis_vendor_id, nama_jenis_vendor
FROM public.jenis_vendor;
`;

const getPengadaanById = `select * from pengadaan where pengadaan_id = $1`;

const addPengadaan = `
    INSERT INTO public.pengadaan (
        nama_pengadaan, 
        tipe_pemilihan_id, 
        jenis_pengadaan_id, 
        jenis_vendor_id, 
        termin_pembayaran,
        tanggal_permintaan,  
        create_date, 
        create_by
    ) 
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $6)
    RETURNING pengadaan_id;
`;

const addItem= `
    INSERT INTO public.item (
        pengadaan_id,
        nama_item,
        harga_item,
        jumlah_item,
        url_foto_item
    ) 
    VALUES ($1, $2, $3, $4, $5);
`;


const removePengadaan = ` delete from pengadaan where pengadaan_id = $1 `;
const validasiPengadaan = ` UPDATE pengadaan
SET 
url_ktp_direktur = $2,
url_nibrba = $3,
url_akta_pendirian = $4,
url_akta_perubahan = $5,
url_dokumen_ijin_lain = $6,
url_dokumen_npwp = $7, 
url_buku_akun_bank = $8, 
url_profil_perusahaan = $9, 
WHERE vendor_id = $1;
`
;


module.exports = {
    getPengadaan,
    getPengadaanById,
    option_Tipe_Pemilihan,
    option_Jenis_Pengadaan,
    option_Jenis_Vendor,
    addPengadaan,
    addItem,
    removePengadaan,
    validasiPengadaan,
};

