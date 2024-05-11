const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getPengadaan);
router.get("/option_Tipe_Pemilihan",controller.option_Tipe_Pemilihan);
router.get("/:id",controller.getPengadaanById);
router.post("/",controller.addPengadaan);
router.delete("/:id",controller.removePengadaan);
router.put("/:id",controller.updatePengadaan); 

module.exports =router;