const getRole = `select * from "role" `;
const getRoleById = `select * from public.role where role_id = $1`;

module.exports={
    getRole,
    getRoleById,
};

