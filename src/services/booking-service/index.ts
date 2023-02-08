import { notFoundError, unauthorizedError } from "@/errors";
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
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) throw notFoundError();

  return { id: booking.id, Room: booking.Room };
}

export type BookingUpdateInput = {
  userId: number;
  bookingId: number;
  roomId: number;
};

async function updateBookingRoom(params: BookingUpdateInput) {
  const booking = await bookingRepository.findBookingByUserId(params.userId);

  if (!booking) throw notFoundError();
  if (booking.id !== params.bookingId) throw unauthorizedError();
  await verifyRoomCapacity(params.roomId);

  return await bookingRepository.updateBookingRoom(params.bookingId, params.roomId);
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

  if (!room) throw notFoundError();
  if (bookings >= room.capacity) throw roomIsFullError();
}

const bookingService = { createOne, findBookingByUserId, updateBookingRoom };
export default bookingService;
