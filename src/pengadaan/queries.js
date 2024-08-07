const { get } = require("../../routes");

const getDaftarPengadaan = `
SELECT
    p.pengadaan_id,
    p.nama_pengadaan,
    p.tanggal_permintaan::DATE AS tanggal_permintaan,
    p.tanggal_pemilihan::DATE AS tanggal_pemilihan,
    p.tanggal_pemilihan_selesai::DATE AS tanggal_pemilihan_selesai,
    p.tipe_pemilihan_id,
    jenis_pengadaan.nama_jenis_pengadaan,
    nama_tipe_pemilihan,
    COALESCE(status.nama_status, 'Diterima') AS nama_status,
    status.status_id,
    nama_jenis_vendor
FROM
    pengadaan p
LEFT JOIN
    bidding_tender bt ON p.pengadaan_id = bt.pengadaan_id
LEFT JOIN
    detail_bidding_tender dbt ON dbt.bt_id = bt.bt_id
LEFT JOIN
    vendor_score vs ON vs.pengadaan_id = p.pengadaan_id
LEFT JOIN
    status ON dbt.status_id = status.status_id
LEFT JOIN
    jenis_pengadaan ON p.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
LEFT JOIN
    jenis_vendor ON p.jenis_vendor_id = jenis_vendor.jenis_vendor_id
INNER JOIN
    tipe_pemilihan ON tipe_pemilihan.tipe_pemilihan_id = p.tipe_pemilihan_id
WHERE 
    dbt.vendor_id = $1 OR (vs.vendor_id = $2 AND vs.approve_presdir IS NOT NULL AND vs.approve_division IS NOT NULL AND vs.approve_department IS NOT NULL)
GROUP BY p.pengadaan_id, jenis_pengadaan.nama_jenis_pengadaan,
nama_tipe_pemilihan,
status.nama_status,
nama_jenis_vendor,
status.status_id
ORDER BY p.create_date DESC
`;

const getDaftarPengadaanAdmin = `
SELECT
    pengadaan.pengadaan_id,
    pengadaan.nama_pengadaan,
    pengadaan.tanggal_permintaan::DATE AS tanggal_permintaan,
    pengadaan.tanggal_pemilihan::DATE AS tanggal_pemilihan,
    pengadaan.tanggal_pemilihan_selesai::DATE AS tanggal_pemilihan_selesai,
    pengadaan.*,
    jenis_pengadaan.nama_jenis_pengadaan,
    nama_tipe_pemilihan,
    status.nama_status,
    pengadaan.status_id,
    nama_jenis_vendor
FROM
    pengadaan
INNER JOIN
    list_item ON pengadaan.pengadaan_id = list_item.pengadaan_id
INNER JOIN
    status ON pengadaan.status_id = status.status_id
LEFT JOIN
    jenis_pengadaan ON pengadaan.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
LEFT JOIN
    jenis_vendor ON pengadaan.jenis_vendor_id = jenis_vendor.jenis_vendor_id
INNER JOIN
    tipe_pemilihan ON tipe_pemilihan.tipe_pemilihan_id = pengadaan.tipe_pemilihan_id
WHERE 
    nama_status NOT IN ('diterima', 'terverifikasi')
GROUP BY pengadaan.pengadaan_id, jenis_pengadaan.nama_jenis_pengadaan,
nama_tipe_pemilihan,
status.nama_status,
pengadaan.status_id,
nama_jenis_vendor
ORDER BY pengadaan.create_date DESC
`;

const option_Select_Status = `
SELECT 
    status.status_id, 
    status.nama_status
FROM
    status
WHERE 
    tipe_status = 'vendor';
`;

const option_Select_Status_Admin = `
SELECT 
    status.status_id, 
    status.nama_status
FROM
    status
WHERE 
    tipe_status = 'head';
`;

const getInformasiPengadaan = `
SELECT 
    pengadaan.pengadaan_id,
    pengadaan.nama_pengadaan,
    jenis_vendor.nama_jenis_vendor,
    pengadaan.tanggal_pemilihan,
    pengadaan.tanggal_pemilihan_selesai,
    pengadaan.status_id,
    pengadaan.tipe_pemilihan_id,
    bidding_tender.link_zoom
FROM 
    pengadaan 
INNER JOIN
    jenis_vendor ON pengadaan.jenis_vendor_id = jenis_vendor.jenis_vendor_id
LEFT JOIN
    bidding_tender ON pengadaan.pengadaan_id = bidding_tender.pengadaan_id
WHERE 
    pengadaan.pengadaan_id = $1
    ORDER BY pengadaan.tanggal_permintaan DESC;
`;

const getInformasiPengadaanPrevious = `
SELECT 
    pengadaan.*,
    pengadaan.jenis_vendor_id AS jenis_v,
    jenis_vendor.nama_jenis_vendor, 
    nama_jenis_pengadaan,
    bidding_tender.bt_id,
    status.nama_status,
    bidding_tender.link_zoom
FROM 
    pengadaan 
LEFT JOIN
    bidding_tender ON pengadaan.pengadaan_id = bidding_tender.pengadaan_id
LEFT JOIN
    jenis_vendor ON pengadaan.jenis_vendor_id = jenis_vendor.jenis_vendor_id
LEFT JOIN
    jenis_pengadaan ON pengadaan.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
LEFT JOIN
    status ON pengadaan.status_id = status.status_id
WHERE 
    pengadaan.pengadaan_id = $1;
`;

const getItemPengadaan = `
SELECT 
    i.nama_item, l.*, i.harga_item
FROM 
    public.item i
LEFT JOIN 
    public.list_item l ON l.item_id = i.item_id
WHERE l.pengadaan_id = $1;
`;

const getVendorPemenang = `
SELECT 
    vendor_pemenang
FROM 
    public.pengadaan 
WHERE pengadaan_id = $1;
`;

const getInformasiPO = `
SELECT 
    i.nama_item, l.*, i.harga_item, po.tanggal_pengiriman, po.po_id
FROM 
    public.item i
LEFT JOIN 
    public.list_item l ON l.item_id = i.item_id
JOIN purchase_order po ON po.pengadaan_id = l.pengadaan_id
WHERE l.pengadaan_id = $1;
`;

const getDokumenPO = `
SELECT * FROM dokumen_po WHERE pengadaan_id = $1;
`;

// const option_Select_Vendor =`
// SELECT 
//     vendor.vendor_id,
//     vendor.nama_vendor
// FROM
//     vendor
// ;
//  `

const getDaftarPengadaanByStatus = `
SELECT
    pengadaan.pengadaan_id,
    pengadaan.nama_pengadaan,
    pengadaan.tanggal_permintaan::DATE AS tanggal_permintaan,
    pengadaan.tanggal_pemilihan::DATE AS tanggal_pemilihan,
    pengadaan.tanggal_pemilihan_selesai::DATE AS tanggal_pemilihan_selesai,
    jenis_pengadaan.nama_jenis_pengadaan,
    nama_tipe_pemilihan,
    status.nama_status,
    dbt.status_id,
    nama_jenis_vendor
FROM
    pengadaan
LEFT JOIN
    bidding_tender bt ON pengadaan.pengadaan_id = bt.pengadaan_id
LEFT JOIN
    detail_bidding_tender dbt ON dbt.bt_id = bt.bt_id
INNER JOIN
    list_item ON pengadaan.pengadaan_id = list_item.pengadaan_id
LEFT JOIN
    status ON dbt.status_id = status.status_id
LEFT JOIN
    jenis_pengadaan ON pengadaan.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
LEFT JOIN
    jenis_vendor ON pengadaan.jenis_vendor_id = jenis_vendor.jenis_vendor_id
INNER JOIN
    tipe_pemilihan ON tipe_pemilihan.tipe_pemilihan_id = pengadaan.tipe_pemilihan_id
WHERE
    dbt.status_id = $1 AND dbt.vendor_id = $2
GROUP BY pengadaan.pengadaan_id, jenis_pengadaan.nama_jenis_pengadaan,
    nama_tipe_pemilihan,
    status.nama_status,
    dbt.status_id,
    nama_jenis_vendor
ORDER BY pengadaan.tanggal_permintaan DESC
`;

const getDaftarPengadaanByVendor = `
SELECT
    *
FROM
    pengadaan
WHERE
    vendor_pemenang = $1
`;

const getDaftarPengadaanAdminByStatus = `
SELECT
    pengadaan.pengadaan_id,
    pengadaan.nama_pengadaan,
    pengadaan.tanggal_pemilihan,
    pengadaan.tanggal_pemilihan_selesai,
    jenis_pengadaan.nama_jenis_pengadaan,
    status.nama_status
FROM
    pengadaan
LEFT JOIN
    status ON pengadaan.status_id = status.status_id
INNER JOIN
    jenis_pengadaan ON pengadaan.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
WHERE
    pengadaan.status_id = $1
    ORDER BY pengadaan.tanggal_permintaan DESC
`;

// const getDaftarPengadaanByStatusVendor = `
// SELECT
//     pengadaan.pengadaan_id,
//     pengadaan.nama_pengadaan,
//     pengadaan.tanggal_pemilihan,
//     pengadaan.tanggal_pemilihan_selesai,
//     jenis_pengadaan.nama_jenis_pengadaan,
//     status.nama_status
//     vendor.nama_vendor
// FROM
//     pengadaan
// INNER JOIN
//     status ON pengadaan.status_id = status.status_id
// INNER JOIN
//     jenis_pengadaan ON pengadaan.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
// INNER JOIN
//     vendor ON pengadaan.vendor_id = vendor.vendor_id
// WHERE
//     pengadaan.status_id = $1
// AND 
//     pengadaan.vendor_id = $2
// `;


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
        item_id,
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
id, 
first_name, 
last_name, 
role_id from public.user;`;


const update_PIC = `
  UPDATE public.pengadaan
  SET 
    pic =$1
  WHERE pengadaan_id = $2;
`;

const update_evaluasi = `
  UPDATE public.pengadaan
  SET 
    evaluasi_vendor =$1
  WHERE pengadaan_id = $2;
`;

const option_Vendor =`
SELECT id, nama_vendor
FROM public.vendor
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
        create_by,
        status_id,
        harga
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7, '5b117843-38aa-47cd-b4f2-24c3f88ab472', $8)
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

const getValidatorByID = `
    SELECT * 
    FROM validasi_pengadaan
    WHERE id = $1;
`;

const addValidator = `
    INSERT INTO validasi_pengadaan (
        status
    ) 
    VALUES (0)
    RETURNING id;
`;

const insertValidatorPengadaan = `
    UPDATE pengadaan
    SET 
    is_validate = $1
    WHERE pengadaan_id = $2
`;

const insertValidatorPemenangPengadaan = `
    UPDATE pengadaan
    SET 
    is_set_pemenang = $1
    WHERE pengadaan_id = $2
`;

const validateDivisiHead = `
    UPDATE validasi_pengadaan
    SET 
    division_head = $1
    WHERE id = $2
`;

const validatePurchasing = `
    UPDATE validasi_pengadaan
    SET 
    purchasing = $1
    WHERE id = $2
`;

const validateDivisi = `
    UPDATE validasi_pengadaan
    SET 
    division = $1
    WHERE id = $2
`;


const validasiPengadaan = ` 
UPDATE public.pengadaan
SET 
tanggal_pemilihan = $1, 
tanggal_pemilihan_selesai = $2, 
pic = $3,
aanwijzing = $4
WHERE pengadaan_id = $5
;`
;

const updateStatusValidate = ` 
UPDATE public.pengadaan
SET 
status_id = '0b3e77e5-140b-4662-9563-dde365358ddc'
WHERE pengadaan_id = $1
;`
;

const tutup = ` 
UPDATE public.pengadaan
SET 
status_id = '3b9a7057-fc96-4894-88b6-24f2f4211110'
WHERE pengadaan_id = $1
;`
;

const validasiPengadaanTender = ` 
UPDATE public.bidding_tender
SET 
link_zoom = $1
WHERE pengadaan_id = $2
;`
;

const validasiPengadaanLangsung = ` 
UPDATE public.pengadaan
SET 
tanggal_pemilihan = $1, 
tanggal_pemilihan_selesai = $2, 
pic = $3,
aanwijzing = $4,
temp_vendor_pemenang = $5
WHERE pengadaan_id = $6
;`
;

const setPemenang = ` 
UPDATE public.pengadaan
SET 
vendor_pemenang = temp_vendor_pemenang
WHERE pengadaan_id = $1;`
;

const setTempPemenang = ` 
UPDATE public.pengadaan
SET 
temp_vendor_pemenang = $1
WHERE pengadaan_id = $2;`
;

const setPemenangTender = ` 
UPDATE public.pengadaan
SET 
temp_vendor_pemenang = $1, harga = $3, durasi_pengerjaan = $4
WHERE pengadaan_id = $2;`
;

const updateHargaDurasiTender = ` 
UPDATE detail_bidding_tender
SET 
pengajuan_harga = $2, durasi_pekerjaan = $3
WHERE dbt_id = $1;`
;

const setPemenang2 = ` 
UPDATE public.detail_bidding_tender
SET 
status_id = '760ad69f-7739-41e1-baf9-7a68665b21e8'
WHERE dbt_id = $1;`
;

const setDitolak = ` 
UPDATE public.detail_bidding_tender
SET 
status_id = '49cd669e-a2e1-4589-8473-d63b110ebbfc'
WHERE bt_id = $1 AND dbt_id != $2;`
;

const getTerbaik = ` 
SELECT COUNT(p.pengadaan_id) AS total, v.nama_vendor
FROM pengadaan p 
JOIN vendor v ON v.id = p.vendor_pemenang
GROUP BY v.id
ORDER BY total DESC
LIMIT 5;
`;


module.exports = {
    getTerbaik,
    getDaftarPengadaan,
    getDaftarPengadaanAdmin,
    getDaftarPengadaanByStatus,
    getDaftarPengadaanAdminByStatus,
    getInformasiPengadaan,
    getInformasiPengadaanPrevious,
    getItemPengadaan,
    getInformasiPO,
    getDokumenPO,
    getDaftarPengadaanByVendor,
    option_Select_Status,
    option_Select_Status_Admin,
    option_PIC,
    update_PIC,
    update_evaluasi,
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
    validasiPengadaanLangsung,
    setPemenang,
    setDitolak,
    setPemenang2,
    setPemenangTender,
    getVendorPemenang,
    validasiPengadaanTender,
    tutup,
    validateDivisi,
    validatePurchasing,
    validateDivisiHead,
    insertValidatorPemenangPengadaan,
    insertValidatorPengadaan,
    addValidator,
    updateStatusValidate,
    getValidatorByID,
    setTempPemenang,
    updateHargaDurasiTender
};

