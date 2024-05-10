const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getStatus);
router.get("/:id",controller.getStatusById);
router.post("/", controller.updateStatus);

module.exports =router;

