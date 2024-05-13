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

const addPengadaan =`INSERT INTO public.pengadaan (
    nama_pengadaan, 
    nama_jenis_pengadaan, 
    nama_jenis_vendor, 
    termin_pembayaran,
    tanggal_permintaan, 
    tanggal_pemilihan, 
    tanggal_pemilihan_selesai, 
    harga, 
    validator_1, 
    validator_2, 
    validator_3, 
    validator_4, 
    create_date, 
    create_by, 
    modif_date, 
    modif_by, 
    pic, 
    vendor_pemenang
) 
VALUES (
    $1, -- nama_pengadaan
    $2, -- nama_jenis_pengadaan
    $3, -- nama_jenis_vendor
    $4, -- termin_pembayaran
    $now(), -- tanggal_permintaan
    $9, -- tanggal_pemilihan
    $10, -- tanggal_pemilihan_selesai
    $11, -- harga
    $12, -- validator_1
    $13, -- validator_2
    $14, -- validator_3
    $15, -- validator_4
    $now(), -- create_date
    $17, -- create_by
    $now(), -- modif_date
    $19, -- modif_by
    $20, -- pic
    $21 -- vendor_pemenang
);

-- Operasi INSERT untuk tabel item
INSERT INTO public.item (nama_item, harga_item, jumlah_item)
VALUES ($5, $6, $7);
`;

const addPengadaan_Insert_Jenis_Vendor = `
-- Insert into public.pengadaan
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

