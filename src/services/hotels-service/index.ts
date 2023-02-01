import enrollmentRepository from "@/repositories/enrollment-repository";
import { hotelRepository } from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";

async function findAll(userId: number) {
  await hasPaidTicketWithHotel(userId);
  return await hotelRepository.findAll();
}

async function hasPaidTicketWithHotel(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw httpStatus.NOT_FOUND;

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw httpStatus.NOT_FOUND;

  const includesHotel = ticket.TicketType.includesHotel;
  const isPaid = ticket.status === TicketStatus.PAID;
  const isRemote = ticket.TicketType.isRemote;

  if (!includesHotel || !isPaid || isRemote) throw httpStatus.PAYMENT_REQUIRED;
}

export const hotelServices = { findAll };
