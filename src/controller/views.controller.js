export default class ViewsController {
  async renderResetPassword(req, res) {
    res.render("passwordreset");
  }

  async renderCambioPassword(req, res) {
    res.render("passwordcambio");
  }

  async renderConfirmacion(req, res) {
    res.render("confirmacion-envio");
  }
}

