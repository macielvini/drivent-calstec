import { notFoundError, unauthorizedError } from "@/errors";
import { Payment } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentsRepository from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getPaymentWithTicketId(userId: number, ticketId: number) {
  const paymentInfo = await paymentsRepository.findWithTicketId(ticketId);

  await checkUserOwnTicket(userId, ticketId);

  return paymentInfo;
}

async function processPayment(userId: number, params: Payment) {
  const ticket = await checkUserOwnTicket(userId, params.ticketId);

  const paymentObj = {
    ticketId: ticket.id,
    price: ticket.TicketType.price,
    issuer: params.cardData.issuer,
    cardNumber: params.cardData.number,
  };

  const data = await paymentsRepository.processPayment(paymentObj);
  return data;
}

async function checkUserOwnTicket(userId: number, ticketId: number) {
  const enrollment = await enrollmentRepository.findUserEnrollment(userId);
  const ticket = await ticketsRepository.findTicketById(ticketId);

  if (!ticket) throw notFoundError();

  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  return ticket;
}

const paymentsServices = { getPaymentWithTicketId, processPayment };
export default paymentsServices;
