const getRole = `select * from role `;
const getDetailRole = `select * from detail_role `;
const getRoleById = `select * from public.role where role_id = $1`;
const getDetailRoleByName = `select id from detail_role where LOWER(nama) = LOWER($1)`;
const addDetailRole = `INSERT INTO detail_role (nama) VALUES ($1) RETURNING id;`;

module.exports={
    getRole,
    getDetailRole,
    getRoleById,
    getDetailRoleByName,
    addDetailRole
};

