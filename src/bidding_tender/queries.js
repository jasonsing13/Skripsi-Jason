const getBidding_Tender =
`SELECT bidding_tender.*, pengadaan.nama_pengadaan, item.nama_item, item.harga_item, 
item.jumlah_item, jenis_pengadaan.nama_jenis_pengadaan
FROM bidding_tender
INNER JOIN pengadaan ON bidding_tender.pengadaan_id = pengadaan.pengadaan_id
INNER JOIN item ON bidding_tender.item_id = item.item_id
INNER JOIN jenis_pengadaan ON bidding_tender.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id;
`;
const getBidding_TenderById = `select * from public.bidding_tender where bt_id = $1`;
const addBidding_Tender = `INSERT INTO public.bidding_tender (bt_id, pengadaan_id, evaluasi_vendor, link_zoom)
VALUES ($1, $2, $3, $4);`
const removeBidding_Tender = ` delete from public.bidding_tender where bt_id = $1 `;
const updateBidding_Tender = `update public.bidding_tender set username =$1 where bt_id = $2 `;


module.exports = {
    getBidding_Tender,
    getBidding_TenderById,
    addBidding_Tender,
    removeBidding_Tender,   
    updateBidding_Tender,
};

