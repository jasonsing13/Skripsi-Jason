const getStatus = `select * from public.status `;
const getStatusById = `select * from public.status where status_id = $1`;

module.exports = {
    getStatus,
    getStatusById,
};

