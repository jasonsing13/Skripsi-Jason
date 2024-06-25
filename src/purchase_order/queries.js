const getPurchase_Order = `select * from public.purchase_order `;
const getPurchase_OrderById = `SELECT po_id, tanggal_po, pengadaan_id, tanggal_pengiriman, alamat_pengiriman, nama_vendor, subTotal, discount, ppn, biaya, total, divHead, vendorApproval FROM public.purchase_order WHERE po_id = $1`;
const addPurchase_Order = `INSERT INTO public.purchase_order (pengadaan_id, tanggal_pengiriman, create_by)
VALUES ($1, $2, $3);`
const removePurchase_Order = ` delete from public.purchase_order where po_id = $1 `;
const updatePurchase_Order = `update public.user set username =$1 where po_id = $2 `;


module.exports = {
    getPurchase_Order,
    getPurchase_OrderById,
    addPurchase_Order,
    removePurchase_Order,
    updatePurchase_Order,
};

