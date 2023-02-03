import { notFoundError } from "@/errors";
import { paymentRequired } from "@/errors/payment-required";
import { HotelEntity, hotelRepository, HotelWithRooms } from "@/repositories/hotel-repository";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import enrollmentsService from "../enrollments-service";
import ticketService from "../tickets-service";

async function findAll(userId: number): Promise<HotelEntity[]> {
  await hasPaidTicketWithHotel(userId);
  const data = await hotelRepository.findAll();
  if (data.length === 0) throw notFoundError();
  return data;
}

async function findWithRoomsById(userId: number, hotelId: number): Promise<HotelWithRooms> {
  await hasPaidTicketWithHotel(userId);
  const data = await hotelRepository.findWithRoomsById(hotelId);

  if (!data) throw httpStatus.NOT_FOUND;

  return data;
}

async function hasPaidTicketWithHotel(userId: number) {
  await enrollmentsService.getOneWithAddressByUserId(userId);
  const ticket = await ticketService.getTicketByUserId(userId);

  const includesHotel = ticket.TicketType.includesHotel;
  const isPaid = ticket.status === TicketStatus.PAID;
  const isRemote = ticket.TicketType.isRemote;

  if (!includesHotel || !isPaid || isRemote) throw paymentRequired();
}

export const hotelServices = { findAll, findWithRoomsById };
