const getItem = `select * from public.item `;
const getItemById = `select * from public.item where item_id = $1`;
const addItem = `INSERT INTO public.item (item_id, nama_item, jumlah_item, harga_item, url_foto_item)
VALUES ($1, $2, $3, $4, $5);`
const removeItem = ` delete from public.item where item = $1 `;
const updateItem = `update public.item set nama_item =$1 where item = $2 `;


module.exports = {
    getItem,
    getItemById,
    addItem,
    removeItem,
    updateItem,
};

