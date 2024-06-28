const getItem = `SELECT * FROM public.item WHERE LOWER(nama_item) LIKE '%' || LOWER($1) || '%'`;
const getItemAll = `SELECT * FROM public.item`;
const getItemById = `select * from public.item where item_id = $1`;
const addItem = `INSERT INTO public.item (nama_item, harga_item)
VALUES ($1, $2);`
const removeItem = ` delete from public.item where item = $1 `;
const updateItem = `update public.item set nama_item =$1 where item = $2 `;


module.exports = {
    getItem,
    getItemAll,
    getItemById,
    addItem,
    removeItem,
    updateItem,
};

