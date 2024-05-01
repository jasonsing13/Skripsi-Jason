const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getDetail_Bidding_Tender);
router.get("/:id",controller.getDetail_Bidding_TenderById);
router.post("/",controller.addDetail_Bidding_Tender);
router.delete("/:id",controller.removeDetail_Bidding_Tender);
router.put("/:id",controller.updateDetail_Bidding_Tender); 

module.exports =router;