import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentsService from "@/services/enrollments-service";

export async function create(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);

  const ticketParams = {
    enrollmentId: enrollment.id,
    ticketTypeId: ticketTypeId,
  };

  await ticketsRepository.create(ticketParams);
}

async function findTicketTypes() {
  return await ticketsRepository.findAllTypes();
}

async function findTicketByUserId(id: number) {
  const enrollment = await enrollmentRepository.findUserEnrollment(id);

  if (!enrollment) throw notFoundError();

  const data = await ticketsRepository.findTicketByUserId(enrollment.id);

  if (!data) {
    throw notFoundError();
  }

  return data;
}

const ticketsServices = { create, findTicketTypes, findTicketByUserId };
export default ticketsServices;
