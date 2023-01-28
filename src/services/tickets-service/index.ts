import ticketsRepository from "@/repositories/tickets-repository";

async function findTicketTypes() {
  return await ticketsRepository.findAllTypes();
}

const ticketsServices = { findTicketTypes };
export default ticketsServices;
