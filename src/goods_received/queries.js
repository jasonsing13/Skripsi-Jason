const getGoods_Received = `select * from public.goods_received `;
const getGoods_ReceivedById = `select * from public.goods_received where received_id = $1`;
const getGoods_ReceivedByPenagdaanId = `select g.*, i.*, p.evaluasi_vendor, DATE(i.tanggal_terima) AS tanggal_terimas, g.received_id from goods_received g
LEFT JOIN item_gr i ON i.received_id = g.received_id
LEFT JOIN pengadaan p ON p.pengadaan_id = g.pengadaan_id
where g.pengadaan_id = $1 AND g.create_by = $2`;
const addGoods_Received = `INSERT INTO public.goods_received (pengadaan_id, url_invoice, url_surat_jalan, create_by)
VALUES ($1, $2, $3, $4);`
const addGoods_ReceivedItem = `INSERT INTO public.item_gr (jumlah_barang, kondisi_barang, bukti_foto, tanggal_terima, deskripsi_barang, received_id)
VALUES ($1, $2, $3, $4, $5, $6);`
const removeGoods_Received = ` delete from public.goods_received where received_id = $1 `;
const updateGoods_Received = `update public.goods_received set username =$1 where received_id = $2 `;


module.exports = {
    getGoods_Received,
    getGoods_ReceivedById,
    addGoods_Received,
    addGoods_ReceivedItem,
    removeGoods_Received,
    updateGoods_Received,
    getGoods_ReceivedByPenagdaanId,
};

