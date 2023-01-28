import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";

async function findTicketTypes() {
  return await ticketsRepository.findAllTypes();
}

async function findTicketByUserId(id: number) {
  const data = await ticketsRepository.findTicketByUserId(id);

  if (!data || !data.enrollmentId || !data.id) {
    throw notFoundError();
  }

  return data;
}

const ticketsServices = { findTicketTypes, findTicketByUserId };
export default ticketsServices;
