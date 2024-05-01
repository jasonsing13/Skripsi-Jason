const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getList_Item);
router.get("/:id",controller.getList_ItemById);
router.post("/",controller.addList_Item);
router.delete("/:id",controller.removeList_Item);
router.put("/:id",controller.updateList_Item); 

module.exports =router;