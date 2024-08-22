import express from "express";
const router = express.Router();
import UsuarioModel from "../models/usuario.model.js";
import { isValidPassword } from "../utils/hashbcrypt.js";
import passport from "passport";

import jwt from "jsonwebtoken";

//login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
 
  try {
    
    const usuario = await UsuarioModel.findOne({ email: email });
      
    if (usuario) {
      
      if (isValidPassword(password, usuario)) {
        //*********CON SESSIONS *******/
        //*****************************/
        res.locals.isAuthenticated = !!usuario;
        res.locals.isNotAdmin = usuario.role !== "admin";
        res.locals.isNotUser = usuario.role !== "usuario"
        res.locals.isAdmin = usuario.role === "admin";
        res.locals.isPremium = usuario.role === "premium";
        res.locals.isUser = usuario.role === "usuario";
       
        req.session.login = true;
        req.session.user = {
          email: usuario.email,
          first_name: usuario.first_name,
          last_name: usuario.last_name,
          role: usuario.role,
        };

        const token = jwt.sign(
          {
            userId : usuario._id,
            email: usuario.email,
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            role: usuario.role,
            idCart: usuario.carts,
          },
          "coderhouse",
          { expiresIn: "1h" }
        );

        res.cookie("coderCookieToken", token, {
          maxAge: 3600000,
          httpOnly: true,
        });
        usuario.last_connection = new Date();
        await usuario.save();
        res.redirect("/current");
      } else {
        res.status(401).send("contraseña no valida");
      }
    } else {
      res.status(404).send("usuario no encontrado");
    }
  } catch (error) {
    res.status(400).send("error en el login");
  }
});

//logout

router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.clearCookie("coderCookieToken");
  res.redirect("/login");
});

export default router;
