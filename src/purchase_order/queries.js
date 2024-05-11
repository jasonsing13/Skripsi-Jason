const getPurchase_Order = `select * from public.purchase_order `;
const getPurchase_OrderById = `select * from public.user where po_id = $1`;
const addPurchase_Order = `INSERT INTO public.purchase_order (po_id, tanggal_pengiriman, pengadaan_id, item_id, nama_item, quantity, status_id, create_date, create_by, modif_date, modif_by)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`
const removePurchase_Order = ` delete from public.purchase_order where po_id = $1 `;
const updatePurchase_Order = `update public.user set username =$1 where po_id = $2 `;


module.exports = {
    getPurchase_Order,
    getPurchase_OrderById,
    addPurchase_Order,
    removePurchase_Order,
    updatePurchase_Order,
};

