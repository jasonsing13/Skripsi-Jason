const { Router } = require('express');
const controller = require(`./controller`);
const router = Router();

router.get("/",controller.getUser);
router.get("/:id",controller.getUserById);
router.post("/",controller.addUser);
router.delete("/:id",controller.removeUser);
router.put("/:id",controller.updateUser); 

module.exports =router;