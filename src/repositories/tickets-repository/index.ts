import { prisma } from "@/config";
import { TicketType } from "@prisma/client";

async function create() {
  return "null";
}

async function findAllTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

const ticketsRepository = { create, findAllTypes };
export default ticketsRepository;
