const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getJenisPengadaan);
router.get("/:id",controller.getJenisPengadaan_Id);

module.exports =router;

