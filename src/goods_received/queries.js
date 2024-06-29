const getGoods_Received = `select * from public.goods_received `;
const getGoods_ReceivedById = `select * from public.goods_received where received_id = $1`;
const getbuktiGRByIdGR = `select * from public.bukti_item_gr where item_gr_id = $1`;
const getGoods_ReceivedByPenagdaanId = `select g.*, i.*, p.evaluasi_vendor, DATE(i.tanggal_terima) AS tanggal_terimas, g.received_id from goods_received g
LEFT JOIN item_gr i ON i.received_id = g.received_id
LEFT JOIN pengadaan p ON p.pengadaan_id = g.pengadaan_id
where g.pengadaan_id = $1 AND g.create_by = $2
GROUP BY i.item_gr_id, g.received_id, p.evaluasi_vendor`;
const addGoods_Received = `INSERT INTO public.goods_received (pengadaan_id, url_invoice, url_surat_jalan, create_by)
VALUES ($1, $2, $3, $4);`
const addGoods_ReceivedItem = `INSERT INTO public.item_gr (item_id, jumlah_barang, kondisi_barang, tanggal_terima, deskripsi_barang, received_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING item_gr_id;`
const addGoods_ReceivedBukti = `INSERT INTO public.bukti_item_gr (item_gr_id, bukti_foto)
VALUES ($1, $2);`
const removeGoods_Received = ` delete from public.goods_received where received_id = $1 `;
const updateGoods_Received = `update public.goods_received set username =$1 where received_id = $2 `;


module.exports = {
    getGoods_Received,
    getGoods_ReceivedById,
    getbuktiGRByIdGR,
    addGoods_Received,
    addGoods_ReceivedItem,
    addGoods_ReceivedBukti,
    removeGoods_Received,
    updateGoods_Received,
    getGoods_ReceivedByPenagdaanId,
};

