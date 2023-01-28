import { prisma } from "@/config";
import { TicketType } from "@prisma/client";

async function create() {
  return "null";
}

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

async function findTicketByUserId(id: number): Promise<TicketResponse> {
  const data = (await prisma.$queryRaw`
    select t.id, t.status, t."ticketTypeId", t."enrollmentId", t."createdAt", t."updatedAt",
	    json_build_object(
        'id', tt.id,
        'name', tt.name,
        'price', tt.price,
        'isRemote', tt."isRemote",
        'includesHotel', tt."includesHotel",
        'createdAt', tt."createdAt",
        'updatedAt', tt."updatedAt"
    ) AS "TicketType"
    from "Enrollment" e
    left join "Ticket" t
    on e.id = t."enrollmentId"
    left join "TicketType" tt
    on t."ticketTypeId" = tt.id
    where e."userId" = ${id};`) as TicketResponseArr;

  return data[0];
}

async function findAllTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

const ticketsRepository = { create, findAllTypes, findTicketByUserId };
export default ticketsRepository;
