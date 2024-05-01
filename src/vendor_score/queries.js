const getUser = `select * from public.vendor_score `;
const getUserById = `select * from public.user where user_id = $1`;
const addUser = `INSERT INTO public.user (user_id, username, password, email, first_name, last_name, phone_number, create_by, create_date, modif_by, modif_date, role_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`
const removeUser = ` delete from public.user where user_id = $1 `;
const updateUser = `update public.user set username =$1 where user_id = $2 `;


module.exports = {
    getUser,
    getUserById,
    addUser,
    removeUser,
    updateUser,
};

