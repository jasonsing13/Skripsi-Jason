const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getGoods_Received);
router.get("/:id",controller.getGoods_ReceivedById);
router.post("/",controller.addGoods_Received);
router.delete("/:id",controller.removeGoods_Received);
router.put("/:id",controller.updateGoods_Received); 

module.exports =router;