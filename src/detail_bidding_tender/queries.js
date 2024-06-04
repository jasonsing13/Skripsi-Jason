const getDetail_Bidding_Tender = `select bidding_tender.* ,jenis_pengadaan.nama_jenis_pengadaan, 
pengadaan.nama_pengadaan, item.nama_item, item.harga_item, item.jumlah_item, jenis_pengadaan.nama_jenis_pengadaan, list_item.*
FROM bidding_tender
INNER JOIN pengadaan ON bidding_tender.pengadaan_id = pengadaan.pengadaan_id
INNER JOIN jenis_pengadaan ON jenis_pengadaan.pengadaan_id = pengadaan.pengadaan_id
INNER JOIN list_item ON list_item.pengadaan_id = pengadaan.pengadaan_id
INNER JOIN item ON list_item.item_id = item.item_id
WHERE bidding_tender.id = $1
`;

const getDetail_Bidding_TenderById = `select * from public.detail_bidding_tender where vendor_id = $1`;
const addDetail_Bidding_Tender = `INSERT INTO public.detail_bidding_tender (id_bt, vendor_id)
VALUES ( 
    $1 -- pengajuan_harga, 
    $2 -- durasi_pekerjaan
    );`

const removeDetail_Bidding_Tender = ` delete from public.detail_bidding_tender where dbt_id = $1 `;
const updateDetail_Bidding_Tender = `update public.detail_bidding_tender set username =$1 where dbt_id = $2 `;


module.exports = {
    getDetail_Bidding_Tender,
    getDetail_Bidding_TenderById,
    addDetail_Bidding_Tender,
    removeDetail_Bidding_Tender,
    updateDetail_Bidding_Tender,
};

