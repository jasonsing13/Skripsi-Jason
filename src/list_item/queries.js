const getList_Item = `select * from public.list_item `;
const getList_ItemById = `select * from public.list_item where user_id = $1`;
const addList_Item = `INSERT INTO public.list_item (list_item_id, pengadaan_id, item_id, quantity, harga_total)
VALUES ($1, $2, $3, $4, $5);`
const removeList_Item = ` delete from public.list_item where user_id = $1 `;
const updateList_Item = `update public.user set username =$1 where list_item_id = $2 `;


module.exports = {
    getList_Item,
    getList_ItemById,
    addList_Item,
    removeList_Item,
    updateList_Item,
};

