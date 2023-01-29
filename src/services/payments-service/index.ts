import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentsRepository from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getPaymentWithTicketId(userId: number, ticketId: number) {
  const paymentInfo = await paymentsRepository.findWithTicketId(ticketId);
  const enrollment = await enrollmentRepository.findUserEnrollment(userId);
  const ticket = await ticketsRepository.findTicketById(ticketId);

  if (!ticket) throw notFoundError();

  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  return paymentInfo;
}

const paymentsServices = { getPaymentWithTicketId };
export default paymentsServices;
