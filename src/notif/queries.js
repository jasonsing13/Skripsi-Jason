const getNotif = `select n.* 
from notification n
JOIN notification_list l ON l.notif_id = n.notif_id
WHERE l.account_id = $1
`;

module.exports = {
    getNotif,
};

