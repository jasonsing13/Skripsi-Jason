const getUser = `select * from public.user u
LEFT JOIN role r ON r.role_id = u.role_id`;
const getUserById = `select * from public.user where user_id = $1`;
const getUserByEmail = `select u.*, r.role_name from public.user u LEFT JOIN role r ON r.role_id = u.role_id where email = $1`;
const addUser = `INSERT INTO public.user (username, password, email, first_name, last_name, phone_number, create_by, role_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`
const removeUser = ` delete from public.user where user_id = $1 `;
const updateUser = `update public.user set username =$1 where user_id = $2 `;


module.exports = {
    getUser,
    getUserById,
    getUserByEmail,
    addUser,
    removeUser,
    updateUser,
};

