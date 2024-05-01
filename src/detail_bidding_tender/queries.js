const getDetail_Bidding_Tender = `select * from public.detail_bidding_tender `;
const getDetail_Bidding_TenderById = `select * from public.detail_bidding_tender where user_id = $1`;
const addDetail_Bidding_Tender = `INSERT INTO public.detail_bidding_tender (dbt_id, pengajuan_harga, vendor_id, bt_id)
VALUES ($1, $2, $3, $4);`
const removeDetail_Bidding_Tender = ` delete from public.detail_bidding_tender where dbt_id = $1 `;
const updateDetail_Bidding_Tender = `update public.detail_bidding_tender set username =$1 where dbt_id = $2 `;


module.exports = {
    getDetail_Bidding_Tender,
    getDetail_Bidding_TenderById,
    addDetail_Bidding_Tender,
    removeDetail_Bidding_Tender,
    updateDetail_Bidding_Tender,
};

