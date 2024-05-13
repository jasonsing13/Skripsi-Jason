const getDetail_Bidding_Tender = `select * detail_bidding_tender.*,vendor.vendor_id, vendor.nama_vendor ,jenis_pengadaan.nama_jenis_pengadaan, 
pengadaan.nama_pengadaan, item.nama_item, item.harga_item, item.jumlah_item, jenis_pengadaan.nama_jenis_pengadaan 
FROM detail_bidding_tender
INNER JOIN vendor ON detail_bidding_tender.vendor_id = vendor.vendor_id
INNER JOIN jenis_pengadaan ON detail_bidding_tender.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
INNER JOIN pengadaan ON detail_bidding_tender.pengadaan_id = pengadaan.pengadaan_id
INNER JOIN item ON detail_bidding_tender.item_id = item.item_id
`;

const getDetail_Bidding_TenderById = `select * from public.detail_bidding_tender where user_id = $1`;
const addDetail_Bidding_Tender = `INSERT INTO public.detail_bidding_tender (pengajuan_harga, durasi_pekerjaan)
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

