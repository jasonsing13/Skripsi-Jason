const getItem_Gr = `select * from public.item_gr `;
const getItem_GrById = `select * from public.item_gr where item_gr_id = $1`;
const addItem_Gr = `INSERT INTO public.item_gr (item_gr_id, nama_item, jumlah_item, kondisi_item, url_foto_item_gr)
VALUES ($1, $2, $3, $4, $5);`
const removeItem_Gr = `delete from public.item_gr where item_gr_id = $1 `;
const updateItem_Gr = `update public.item_gr set username =$1 where item_gr_id = $2 `;


module.exports = {
    getItem_Gr,
    getItem_GrById,
    addItem_Gr,
    removeItem_Gr,
    updateItem_Gr,
};

