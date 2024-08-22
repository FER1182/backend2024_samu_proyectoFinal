import express from "express";

const router = express.Router()
import ProductController from "../controller/products.controller.js";
const productController = new ProductController();
import passport from "passport";
import authorizeRole from "../middleware/checkrole.js";
import  authErrorHandler  from "../middleware/authErrorHandler.js";
import authenticateJWT from "../middleware/authMiddleware.js";

router.get("/",authorizeRole(["usuario","premium"]),productController.getProducts)


router.get("/realtimeproducts",authorizeRole(["admin","premium"]), productController.renderRealTimeProducts);

router.get("/:pid",passport.authenticate("jwt", {session :false}), productController.getProductById)
//estos no tienen vistas solo con postman
router.post("/",authorizeRole(["admin","premium"]), productController.addProduct)
router.put("/:pid",authorizeRole(["admin","premium"]), productController.updateProduct)
router.delete("/:pid",authorizeRole(["admin","premium"]), productController.deleteProduct)


export default router