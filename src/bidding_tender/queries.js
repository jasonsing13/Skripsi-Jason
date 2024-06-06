const getBidding_Tender =
`SELECT bidding_tender.*, pengadaan.nama_pengadaan, item.nama_item, item.harga_item, 
item.jumlah_item, jenis_pengadaan.nama_jenis_pengadaan
FROM bidding_tender
INNER JOIN pengadaan ON bidding_tender.pengadaan_id = pengadaan.pengadaan_id
INNER JOIN item ON bidding_tender.item_id = item.item_id
INNER JOIN jenis_pengadaan ON bidding_tender.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id;
`;

const getBidding = `
SELECT 
bidding_tender.*, 
pengadaan.nama_pengadaan, 
item.nama_item, 
item.harga_item, 
item.jumlah_item, 
jenis_pengadaan.nama_jenis_pengadaan
FROM 
bidding_tender
INNER JOIN 
detail_bidding_tender ON detail_bidding_tender.bt_id = bidding_tender.bt_id
INNER JOIN 
pengadaan ON bidding_tender.pengadaan_id = pengadaan.pengadaan_id
INNER JOIN 
item ON bidding_tender.item_id = item.item_id
INNER JOIN 
jenis_pengadaan ON bidding_tender.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
INNER JOIN 
tipe_pemilihan ON pengadaan.tipe_pemilihan_id = tipe_pemilihan.tipe_pemilihan_id
WHERE 
tipe_pemilihan.tipe_pemilihan_id = '4ff07c90-7efb-4a4a-8715-d53748a387d6';
`
;

const getTender = `SELECT 
bidding_tender.*, 
pengadaan.nama_pengadaan, 
item.nama_item, 
item.harga_item, 
item.jumlah_item, 
jenis_pengadaan.nama_jenis_pengadaan
FROM 
bidding_tender
INNER JOIN 
pengadaan ON bidding_tender.pengadaan_id = pengadaan.pengadaan_id
INNER JOIN 
item ON bidding_tender.item_id = item.item_id
INNER JOIN 
jenis_pengadaan ON bidding_tender.jenis_pengadaan_id = jenis_pengadaan.jenis_pengadaan_id
INNER JOIN 
tipe_pemilihan ON pengadaan.tipe_pemilihan_id = tipe_pemilihan.tipe_pemilihan_id
WHERE 
tipe_pemilihan.tipe_pemilihan_id = 'b8649cf1-3da3-4258-8e2d-459e10b1b95f';
`
;

const getLinkZoom = `
SELECT link_zoom 
FROM bidding_tender 
WHERE bt_id = $1`;

const getBidding_TenderById = `select * from public.bidding_tender where bt_id = $1`;
const getBidding_TenderDetailById = `select bidding_tender.* ,jenis_pengadaan.nama_jenis_pengadaan, pengadaan.harga AS harga_pengadaan, 
pengadaan.nama_pengadaan, item.nama_item, item.harga_item, item.jumlah_item, jenis_pengadaan.nama_jenis_pengadaan, list_item.*
FROM bidding_tender
LEFT JOIN pengadaan ON bidding_tender.pengadaan_id = pengadaan.pengadaan_id
LEFT JOIN jenis_pengadaan ON jenis_pengadaan.jenis_pengadaan_id = pengadaan.jenis_pengadaan_id
LEFT JOIN list_item ON list_item.pengadaan_id = pengadaan.pengadaan_id
LEFT JOIN item ON list_item.item_id = item.item_id
WHERE pengadaan.pengadaan_id = $1
`;

const getBidding_TenderVendorStatus = `select bd.status_id
FROM bidding_tender bt
LEFT JOIN detail_bidding_tender bd ON bd.bt_id = bt.bt_id
WHERE bt.pengadaan_id = $1 AND bd.vendor_id = $2
GROUP BY bd.dbt_id
`;

const addBidding_Tender = `INSERT INTO public.bidding_tender (pengadaan_id)
VALUES ($1);`
const removeBidding_Tender = ` delete from public.bidding_tender where bt_id = $1 `;
const updateBidding_Tender = `update public.bidding_tender set username =$1 where bt_id = $2 `;


module.exports = {
    getBidding_Tender,
    getBidding,
    getTender,
    getLinkZoom,
    getBidding_TenderById,
    getBidding_TenderDetailById,
    getBidding_TenderVendorStatus,
    addBidding_Tender,
    removeBidding_Tender,   
    updateBidding_Tender,
};

