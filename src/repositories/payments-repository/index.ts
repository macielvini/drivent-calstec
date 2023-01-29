import { prisma } from "@/config";

async function findWithTicketId(id: number) {
  const data = await prisma.payment.findFirst({
    where: { ticketId: id },
  });
  return data;
}

const paymentsRepository = { findWithTicketId };

export default paymentsRepository;
