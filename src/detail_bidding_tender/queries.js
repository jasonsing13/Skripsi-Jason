const getDetail_Bidding_Tender = `select bidding_tender.* ,jenis_pengadaan.nama_jenis_pengadaan, 
pengadaan.nama_pengadaan, item.nama_item, item.harga_item, item.jumlah_item, jenis_pengadaan.nama_jenis_pengadaan, list_item.*
FROM bidding_tender
INNER JOIN pengadaan ON bidding_tender.pengadaan_id = pengadaan.pengadaan_id
INNER JOIN jenis_pengadaan ON jenis_pengadaan.pengadaan_id = pengadaan.pengadaan_id
INNER JOIN list_item ON list_item.pengadaan_id = pengadaan.pengadaan_id
INNER JOIN item ON list_item.item_id = item.item_id
WHERE bidding_tender.id = $1
`;

const getDetail_Bidding_TenderById = `select pengajuan_harga, durasi_pekerjaan, dbt.status_id, v.nama_vendor, jv.nama_jenis_vendor, s.nama_status, v.id AS vendor_id, dbt.bt_id, dbt.dbt_id
from public.detail_bidding_tender dbt 
LEFT JOIN vendor v ON v.id = dbt.vendor_id
LEFT JOIN jenis_vendor jv ON jv.jenis_vendor_id = v.jenis_vendor_id
LEFT JOIN status s ON s.status_id = dbt.status_id
where bt_id = $1
GROUP BY dbt.dbt_id, v.nama_vendor, jv.nama_jenis_vendor, s.nama_status, v.id, dbt.bt_id, dbt.dbt_id`;

const getDetail_Bidding_TenderByIdnV = `select dbt_id
from public.detail_bidding_tender
where bt_id = $1 AND vendor_id = $2`;

const addDetail_Bidding_Tender = `INSERT INTO public.detail_bidding_tender (bt_id, vendor_id)
VALUES ( 
    $1,
    $2
    )
RETURNING dbt_id;`

const removeDetail_Bidding_Tender = ` delete from public.detail_bidding_tender where dbt_id = $1 `;
const updateDetail_Bidding_Tender = `
update public.detail_bidding_tender set pengajuan_harga = $1, durasi_pekerjaan = $2, status_id = '9e18ab27-4557-41eb-b3c1-430c67377830' where bt_id = $3 AND vendor_id = $4; `;
const updateStatusDetail_Bidding_Tender = `update public.detail_bidding_tender set status_id = $1 where dbt_id = $2 `;


module.exports = {
    getDetail_Bidding_Tender,
    getDetail_Bidding_TenderById,
    addDetail_Bidding_Tender,
    removeDetail_Bidding_Tender,
    updateDetail_Bidding_Tender,
    updateStatusDetail_Bidding_Tender,
    getDetail_Bidding_TenderByIdnV
};

