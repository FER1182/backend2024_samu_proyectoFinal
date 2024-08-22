import express from "express";
const router = express.Router();
import ViewsController from "../controller/views.controller.js";
const viewsController = new ViewsController();

import { UserDTO } from "../user.dto.js";
import passport from "passport";
import logger from "../utils/logger.js";

router.get("/",(req, res, next) => {passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.redirect("/login"); // Si no hay usuario, redirigimos al login.
      }
      req.user = user; // Asigna el usuario a la solicitud.
      return next(); // Continúa al siguiente middleware.
    })(req, res, next);
  },
  (req, res) => {
    res.redirect("/current"); // Redirige a la página actual.
  }
);


router.get("/chat",passport.authenticate("jwt", { session: false }),(req, res) => {
    if (req.user.role !== "admin") {
      res.render("chat", { titulo: "CHAT" });
    } else {
      res.send("No tiene acceso");
    }
  }
);
router.get("/contacto", (req, res) => {
  res.render("contacto");
});

router.get("/login", (req, res) => {
  if (req.session.login) {
    return res.redirect("/current");
  } else {
    res.render("login");
  }
});

router.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
});

router.get("/current",(req, res, next) => {passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.redirect("/login"); // Si no hay usuario, redirigimos al login.
      }
      req.user = user; // Asigna el usuario a la solicitud.
      return next(); // Continúa al siguiente middleware.
    })(req, res, next);
  },
  (req, res) => {
   
    const user = new UserDTO(req.user);
    
    const isAdmin = user.role === "admin";
    const isPremium = user.role === "premium";
    const isUser = user.role === "usuario";

    res.render("profile", { user, isAdmin, isPremium, isUser });
  }
);
router.get('/success', (req, res) => {
  res.render('success');
});

router.get("/loggerTest", (req, res) => {
  req.logger.fatal("mensaje de fatal");
  req.logger.error("mensaje de error");
  req.logger.warn("mensaje de warning");
  req.logger.info("mensaje de info");
  req.logger.http("mensaje de http");
  req.logger.debug("mensaje de debug");
  res.send("logs generados");
});

router.get("/reset-password", viewsController.renderResetPassword);
router.get("/password", viewsController.renderCambioPassword);
router.get("/confirmacion-envio", viewsController.renderConfirmacion);

export default router;
