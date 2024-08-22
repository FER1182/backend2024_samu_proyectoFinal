import TicketModel from "../models/ticket.model.js";

class TicketRepository {
  async addTickets(totalCompra, comprador) {
    {
       
      try {
        const ticket = new TicketModel({ amount: totalCompra, purchaser: comprador });
        return await ticket.save();
      } catch (error) {
        throw new Error(`Error adding tickets: ${error.message}`);
      }
    }
  }
}

export default TicketRepository;
