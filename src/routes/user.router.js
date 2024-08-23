import express from "express";
const router = express.Router();
import UserController from "../controller/user.controller.js";
const userController = new UserController();
import passport from "passport";

//ruta Post para generar un usuario y almacenarlo en mongodb
router.get("/",passport.authenticate("jwt", { session: false }), userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.post("/",userController.createUser); 
router.delete("/deleteInactive", userController.deleteInactiveUsers);
router.delete("/:id", userController.deleteUser);


router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.put("/premium/:uid", userController.cambioRolPremium);

import UserRepository from "../repositories/user.repository.js";
const userRepository = new UserRepository();
//Vamos a crear un middleware para Multer y lo vamos a importar: 
import upload from "../middleware/multer.js";

router.post("/:uid/documents", upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), async (req, res) => {
    const { uid } = req.params;
    const uploadedDocuments = req.files;

    try {
        const user = await userRepository.getUserById(uid);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        

        if (uploadedDocuments) {
            if (uploadedDocuments.document) {
                user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if (uploadedDocuments.products) {
                user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if (uploadedDocuments.profile) {
                user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }
        }

        

        await user.save();

        res.status(200).send("Documentos cargados exitosamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor");
    }
})

export default router;
