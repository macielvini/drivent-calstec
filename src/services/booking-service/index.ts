import { notFoundError } from "@/errors";
import { paymentRequired } from "@/errors/payment-required";
import { roomIsFullError } from "@/errors/room-is-full-error";
import bookingRepository from "@/repositories/booking-repository";
import hotelRepository from "@/repositories/hotel-repository";
import { Booking, TicketStatus } from "@prisma/client";
import ticketService from "../tickets-service";

async function createOne(userId: number, roomId: number): Promise<Booking> {
  await verifyTicketRemotePaidIncludesHotel(userId);
  await verifyRoomCapacity(roomId);

  return await bookingRepository.createOne({ userId, roomId });
}

async function findBookingByUserId(userId: number) {
  const data = await bookingRepository.findBookingByUserId(userId);

  if (!data) throw notFoundError();

  return data;
}

async function verifyTicketRemotePaidIncludesHotel(userId: number) {
  const ticket = await ticketService.getTicketByUserId(userId);

  const includesHotel = ticket.TicketType.includesHotel;
  const isPaid = ticket.status === TicketStatus.PAID;
  const isRemote = ticket.TicketType.isRemote;

  if (!includesHotel || !isPaid || isRemote) throw paymentRequired();
}

async function verifyRoomCapacity(roomId: number) {
  const bookings = await bookingRepository.countRoomBookings(roomId);
  const room = await hotelRepository.findRoomById(roomId);

  if (bookings >= room.capacity) throw roomIsFullError();
}

const bookingService = { createOne, findBookingByUserId };
export default bookingService;
