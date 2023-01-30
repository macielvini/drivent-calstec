import { prisma } from "@/config";
import { TicketType } from "@prisma/client";

export type TicketResponse = {
  id: number;
  status: string; //RESERVED | PAID
  ticketTypeId: number;
  enrollmentId: number;
  TicketType: {
    id: number;
    name: string;
    price: number;
    isRemote: boolean;
    includesHotel: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type TicketResponseArr = TicketResponse[];

export type CreateTicketParams = {
  ticketTypeId: number;
  enrollmentId: number;
};

async function create(ticketParams: CreateTicketParams) {
  const { ticketTypeId, enrollmentId } = ticketParams;

  const data = await prisma.ticket.create({
    data: { enrollmentId: enrollmentId, ticketTypeId: ticketTypeId, status: "RESERVED" },
    include: { TicketType: true },
  });

  return data;
}

async function findTicketByUserId(id: number) {
  const data = await prisma.ticket.findFirst({
    where: { enrollmentId: id },
    include: { TicketType: true },
  });

  return data;
}

async function findAllTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

async function findTicketById(id: number) {
  return await prisma.ticket.findUnique({ where: { id: id }, include: { TicketType: true } });
}

const ticketsRepository = { create, findAllTypes, findTicketByUserId, findTicketById };
export default ticketsRepository;
