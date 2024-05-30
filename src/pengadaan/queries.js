const getDaftarPengadaan = `
SELECT
    pengadaan.pengadaan_id,
    pengadaan.nama_pengadaan,
    pengadaan.tanggal_pemilihan,
    pengadaan.tanggal_pemilihan_selesai,
    jenis_pengadaan.nama_jenis_pengadaan,
    status.nama_status
FROM
    pengadaan
INNER JOIN
    status ON pengadaan.status_id = status.status_id
INNER JOIN
    jenis_pengadaan ON pengadaan.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id;
`;

const option_Select_Status = `
SELECT 
    status.status_id, 
    status.nama_status
FROM
    status
WHERE
    nama_status IN ('buka', 'tutup') 
    AND tipe_status = 'dp';
`;


const getDaftarPengadaanByStatus = `
SELECT
    pengadaan.pengadaan_id,
    pengadaan.nama_pengadaan,
    pengadaan.tanggal_pemilihan,
    pengadaan.tanggal_pemilihan_selesai,
    jenis_pengadaan.nama_jenis_pengadaan,
    status.nama_status
FROM
    pengadaan
INNER JOIN
    status ON pengadaan.status_id = status.status_id
INNER JOIN
    jenis_pengadaan ON pengadaan.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
WHERE
    pengadaan.status_id = $1;
`;


// const getDaftarPengadaan = `
// SELECT 
// p.pengadaan_id, 
// p.nama_pengadaan, 
// p.tanggal_pemilihan, 
// p.tanggal_pemilihan_selesai,
// jp.nama_jenis_pengadaan,
// s.nama_status
// FROM 
// public.pengadaan p
// JOIN 
// public.status s ON p.status_id = s.status_id
// JOIN 
// public.jenis_pengadaan jp ON p.jenis_pengadaan_id = jp.jenis_pengadaan_id;
// `
// ;

const getItem = `
SELECT i.item_id, i.nama_item, i.quantity, i.harga_item, li.harga_total
FROM public.item i
JOIN public.mapping_item_list_item mili ON i.item_id = mili.item_id
JOIN public.list_item li ON mili.list_item_id = li.list_item_id
WHERE li.pengadaan_id = $1
`;


const addListItem = `
    INSERT INTO public.list_item (
        list_item_id,
        pengadaan_id,
        quantity,
        harga_total
    ) 
    VALUES ($1, $2, $3, $4)
    RETURNING list_item_id;
`;

const addMappingItemListItem = `
    INSERT INTO public.mapping_item_list_item (
        mapping_id,
        list_item_id,
        item_id
    ) 
    VALUES ($1, $2, $3);
`;

const getItemsByPengadaanId = `
    SELECT i.*
    FROM public.item i
    INNER JOIN public.mapping_item_list_item m ON i.item_id = m.item_id
    INNER JOIN public.list_item l ON m.list_item_id = l.list_item_id
    WHERE l.pengadaan_id = $1;
`;

const option_PIC = `
SELECT 
user_id, 
first_name, 
last_name, 
role_id from public.user;`;


const update_PIC = `
  UPDATE public.pengadaan
  SET 
    pic =$1
  WHERE user_id = $2;
`;

const option_Vendor =`
SELECT vendor_id, nama_vendor
FROM public.vendor
WHERE vendor_id =$1
;
`;

const option_Tipe_Pemilihan1 = `SELECT tipe_pemilihan_id, nama_tipe_pemilihan
FROM public.tipe_pemilihan
WHERE nama_tipe_pemilihan IN ('penunjukkan_langsung', 'vendor_scoring');
`;


const option_Tipe_Pemilihan2 = `SELECT tipe_pemilihan_id, nama_tipe_pemilihan
FROM public.tipe_pemilihan;
`;


const option_Jenis_Pengadaan = `Select jenis_pengadaan_id, nama_jenis_pengadaan from jenis_pengadaan;
`;

const option_Jenis_Vendor = `SELECT jenis_vendor_id, nama_jenis_vendor
FROM public.jenis_vendor;
`;

const getPengadaanById = `select * from pengadaan where pengadaan_id = $1`;

const addPengadaan = `
    INSERT INTO public.pengadaan (
        pengadaan_id,
        nama_pengadaan, 
        tipe_pemilihan_id, 
        jenis_pengadaan_id, 
        jenis_vendor_id, 
        termin_pembayaran,
        tanggal_permintaan,  
        create_date, 
        create_by
    ) 
    VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $6)
    RETURNING pengadaan_id;
`;

const addItem = `
    INSERT INTO public.item (
        item_id,
        nama_item,
        jumlah_item,
        harga_item,
        pengadaan_id,
    ) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING item_id;
`;


const removePengadaan = ` delete from pengadaan where pengadaan_id = $1 `;

const validasiPengadaan = ` 
UPDATE public.pengadaan
SET 
tanggal_pemilihan = $1, 
tanggal_pemilihan_selesai = $3, 
pic = $4, 
jenis_pengadaan_id = $5, 
vendor_id = $6
WHERE pengadaan_id = $7;
;`
;


module.exports = {
    getDaftarPengadaan,
    getDaftarPengadaanByStatus,
    option_Select_Status,
    option_PIC,
    update_PIC,
    option_Vendor,
    getPengadaanById,
    option_Tipe_Pemilihan1,
    option_Tipe_Pemilihan2,
    option_Jenis_Pengadaan,
    option_Jenis_Vendor,
    addPengadaan,
    addItem,
    addListItem,
    addMappingItemListItem,
    getItemsByPengadaanId,
    getItem,
    removePengadaan,
    validasiPengadaan,
};

