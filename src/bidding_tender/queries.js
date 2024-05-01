const getBidding_Tender = `select * from public.bidding_tender `;
const getBidding_TenderById = `select * from public.bidding_tender where user_id = $1`;
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
