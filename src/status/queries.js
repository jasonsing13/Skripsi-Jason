const getStatus = `select * from public.status `;
const getStatusById = `select * from public.status where status_id = $1`;
const updateStatus = 'UPDATE vendors SET status = $1 WHERE id = $2';
module.exports = {
    getStatus,
    getStatusById,
    updateStatus
};

