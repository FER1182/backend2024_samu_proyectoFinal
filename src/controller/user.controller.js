import UserRepository from "../repositories/user.repository.js";
const userRepository = new UserRepository();
import jwt from "jsonwebtoken";
import generarResetToken from "../utils/tokenreset.js";
import path from  "path"
import EmailManager from "../services/email.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
const emailManager = new EmailManager();

export default class UserController {
  constructor() {
    this.createUser = this.createUser.bind(this);
    this.generateToken = this.generateToken.bind(this);
  }
   generateToken(nuevoUsuario) {
    return jwt.sign(
      {
        usuario: nuevoUsuario.email,
        first_name: nuevoUsuario.first_name,
        last_name: nuevoUsuario.last_name,
        role: nuevoUsuario.role,
        idCart: nuevoUsuario.carts,
      },
      "coderhouse",
      { expiresIn: "1h" }
    );
  }
  async getAllUsers(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).send("Acceso Denegado solo para administradores");
      }
      const users = await userRepository.getUsers();
     
      const usersMapeado= users.map(user => ({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        idUser: user._id,
        lastConection: user.last_connection
      }));
      res.status(200).render('users', { users: usersMapeado });
    } catch (error) {
      res.status(500).send("Error al obtener los usuarios");
    }
  }

  async getUserById(req, res) {
    try {
      const id = req.params.id;

      const user = await userRepository.getUser(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Error al obtener el usuario admi");
    }
  }

  async createUser(req, res) {
    try {
      const userData = req.body;

      const user = await userRepository.addUser(userData);
      
      const token = this.generateToken(user);
      
      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });
   
      res.render('success');
    } catch (error) {
      res.status(500).send(`Error al crear el usuario ${error.message}`);
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const userData = req.body;
      const user = await userRepository.modifyUser(id, userData);
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Error al actualizar el usuario");
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const user = await userRepository.removeUser(id);
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Error al eliminar el usuario");
    }
  }
  async deleteInactiveUsers(req, res) {
    try {
      // Calcular la fecha límite (últimos 30 minutos)
      const treintaMinutosAtras = new Date(Date.now() - 30 * 60 * 1000);
      
      // Eliminar usuarios inactivos y obtener la lista de usuarios eliminados
      const inactiveUsers = await userRepository.removeInactiveUsers(treintaMinutosAtras);
      for (const user of inactiveUsers) {
        
        await emailManager.enviarCorreoEliminacion(user.email, user.first_name);
      }

      res.status(200).send("Usuarios inactivos eliminados y notificados por correo.");
    } catch (error) {
      res.status(500).send(`Error al eliminar usuarios inactivos: ${error.message}`);
    }
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
      const user = await userRepository.getUserByEmail(email);
      console.log(user);
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      const token = generarResetToken();
      user.resetToken = {
        token: token,
        expires: new Date(Date.now() + 3600000),
      };
      await user.save();
      await emailManager.enviarCorreoRestablecimiento(
        email,
        user.first_name,
        token
      );
      res.redirect("/confirmacion-envio");
    } catch (error) {
      res
        .status(500)
        .send(`Error al restablecer la contraseña: ${error.message}`);
    }
  }

  async resetPassword(req, res) {
    const { email, token, password } = req.body;
    try {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        return res.render("passwordcambio", { error: "Usuario no encontrado" });
      }
      const resetToken = user.resetToken;
      if (!resetToken || resetToken.token !== token) {
        return res.render("passwordreset", { error: "Token inválido" });
      }
      if (resetToken.expires < Date.now()) {
        return res.render("passwordreset", { error: "Token expirado" });
      }

      if (isValidPassword(password, user)) {
        return res.render("passwordcambio", {
          error: "La nueva contraseña no puede ser igual a la anteriori",
        });
      }

      user.password = createHash(password);
      user.resetToken = undefined;
      await user.save();
      return res.redirect("/login");
    } catch (error) {
      res
        .status(500)
        .render("passwordreset", { error: "Error interno del servidor" });
    }
  }

  

  async cambioRolPremium(req, res) {
    const uid = req.params.uid;
    
    try {
      const user = await userRepository.getUserById(uid);

      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      const documentacionRequerida = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];

      const userDocuments = user.documents.map(doc => path.basename(doc.name, path.extname(doc.name)));
        console.log(userDocuments);


      // const userDocuments = user.documents.map(doc => doc.name);
      // console.log(userDocuments);
      const tieneDocumentacion = documentacionRequerida.every(doc => userDocuments.includes(doc));
      console.log(tieneDocumentacion);
      if (!tieneDocumentacion) {
          return res.status(400).send("El usuario tiene que completar toda la documentacion requerida");
      }
      const nuevoRol = user.role === "usuario" ? "premium" : "usuario";
      const actualizado = await userRepository.modifyUser(uid, {
        role: nuevoRol,
      });

      res.status(200).json(actualizado);
    } catch (error) {
      res
        .status(500)
        .send(`Error al cambiar el rol de usuario: ${error.message}`);
    }
  }
}
