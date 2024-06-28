const getNotif = `select n.* 
from notification n
JOIN notification_list l ON l.notif_id = n.notif_id
WHERE l.account_id = $1
ORDER BY cdate DESC
LIMIT 5
`;

const getNotifAll = `select n.* 
from notification n
JOIN notification_list l ON l.notif_id = n.notif_id
WHERE l.account_id = $1
ORDER BY cdate DESC
`;

const addNotif = `INSERT INTO notification (isi) VALUES ($1)
RETURNING notif_id
`;

const addNotifList = `INSERT INTO notification_list (notif_id, account_id) VALUES ($1, $2)
`;

module.exports = {
    getNotif,
    getNotifAll,
    addNotif,
    addNotifList
};

