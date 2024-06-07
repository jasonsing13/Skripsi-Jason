const getGoods_Received = `select * from public.goods_received `;
const getGoods_ReceivedById = `select * from public.goods_received where received_id = $1`;
const getGoods_ReceivedByPenagdaanId = `select * from goods_received where pengadaan_id = $1 AND create_by = $2`;
const addGoods_Received = `INSERT INTO public.goods_received (pengadaan_id, url_invoice, url_surat_jalan, create_by)
VALUES ($1, $2, $3, $4);`
const removeGoods_Received = ` delete from public.goods_received where received_id = $1 `;
const updateGoods_Received = `update public.goods_received set username =$1 where received_id = $2 `;


module.exports = {
    getGoods_Received,
    getGoods_ReceivedById,
    addGoods_Received,
    removeGoods_Received,
    updateGoods_Received,
    getGoods_ReceivedByPenagdaanId
};

