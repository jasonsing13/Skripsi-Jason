const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getBidding_Tender);
router.get("/:id",controller.getBidding_TenderById);
router.post("/",controller.addBidding_Tender);
router.delete("/:id",controller.removeBidding_Tender);
router.put("/:id",controller.updateBidding_Tender); 

module.exports =router;