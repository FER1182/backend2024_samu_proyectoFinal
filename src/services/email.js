import nodemailer from "nodemailer";

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "fer.232@gmail.com",
        pass: "svmu xukg cvzz kzzb",
      },
    });
  }

  async enviarCorreoCompra(email, first_name, ticket) {
    try {
      const mailOptions = {
        from: "CoderHouse test",
        to: email,
        subject: `Gracias por tu compra ${first_name}`,
        html: `<div>
                        <h1>Gracias por tu compra ${first_name}</h1>
                        <h2>Ticket de compra</h2>
                        <h3>Id del ticket: ${ticket}</h3>
                        <h3>Fecha de compra: ${new Date().toLocaleString()}</h3>
                        </div>`,
      };
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.log("error al enviar el mail");
    }
  }

  async enviarCorreoRestablecimiento(email, first_name, token) {
    try {
      const mailOptions = {
        from: "CoderHouse",
        to: email,
        subject: `Restablecimiento de contraseña ${first_name}`,
        html: `<div>
                        <h1>Restablecimiento de contraseña ${first_name}</h1>
                        <h2>Token de restablecimiento</h2>
                        <h3>Token: ${token}</h3>
                        <h3>Fecha de restablecimiento: ${new Date().toLocaleString()}</h3>
                        <p> Este token caduca en 60 minutos. </p>
                        <a href="http://localhost:8080/password">Restablecer contraseña</a>    
                        </div>`,
      };
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.log("error al enviar el correo de restablecimiento", error);
    }
  }
}

export default EmailManager;
