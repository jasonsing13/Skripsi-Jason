const getGoods_Received = `select * from public.goods_received `;
const getGoods_ReceivedById = `select * from public.goods_received where received_id = $1`;
const addGoods_Received = `INSERT INTO public.goods_received (received_id, penerima, item_gr_id, pengadaan_id, url_invoice, url_surat_jalan, status_id, create_date, create_by, modif_date, modif_by)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`
const removeGoods_Received = ` delete from public.goods_received where received_id = $1 `;
const updateGoods_Received = `update public.goods_received set username =$1 where received_id = $2 `;


module.exports = {
    getGoods_Received,
    getGoods_ReceivedById,
    addGoods_Received,
    removeGoods_Received,
    updateGoods_Received,
};

