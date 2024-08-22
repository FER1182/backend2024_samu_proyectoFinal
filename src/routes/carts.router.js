import express from "express";

const router = express.Router()
import CartsController from "../controller/carts.controller.js";
const cartsController = new CartsController();
import passport from "passport";

router.get("/", cartsController.getCarts);
router.get("/:cid", cartsController.getCartById);

router.post("/", cartsController.addCart);   
router.post("/:cid/product/:pid",passport.authenticate("jwt", {session :false}), cartsController.updateCart);
router.post("/:cid/purchase/",passport.authenticate("jwt", {session :false}), cartsController.purchaseCart);
router.delete("/:cid/product/:pid", cartsController.deleteProductCart);
router.delete("/:cid", cartsController.emptyCart)



export default router