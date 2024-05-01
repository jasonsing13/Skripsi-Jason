const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getTipe_Pemilihan);
router.get("/:id",controller.getTipe_PemilihanById);

module.exports =router;