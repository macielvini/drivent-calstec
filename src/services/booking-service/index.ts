import { paymentRequired } from "@/errors/payment-required";
import bookingRepository from "@/repositories/booking-repository";
import { Booking, TicketStatus } from "@prisma/client";
import ticketService from "../tickets-service";

async function createOne(userId: number, roomId: number): Promise<Booking> {
  await verifyTicketRemotePaidIncludesHotel(userId);
  return await bookingRepository.createOne({ userId, roomId });
}

async function verifyTicketRemotePaidIncludesHotel(userId: number) {
  const ticket = await ticketService.getTicketByUserId(userId);

  const includesHotel = ticket.TicketType.includesHotel;
  const isPaid = ticket.status === TicketStatus.PAID;
  const isRemote = ticket.TicketType.isRemote;

  if (!includesHotel || !isPaid || isRemote) throw paymentRequired();
}

const bookingService = { createOne };
export default bookingService;
