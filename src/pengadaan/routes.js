router.get("/",controller.getPengadaan);
router.get("/:id",controller.getPengadaanById);
router.post("/",controller.addPengadaan);
router.delete("/:id",controller.removePengadaan);
router.put("/:id",controller.updatePengadaan); 

module.exports =router;