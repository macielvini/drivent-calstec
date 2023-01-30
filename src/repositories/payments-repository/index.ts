import { prisma } from "@/config";

async function findWithTicketId(id: number) {
  const data = await prisma.payment.findFirst({
    where: { ticketId: id },
  });
  return data;
}

export type Payment = {
  ticketId: number;
  price: number;
  issuer: string;
  cardNumber: string;
};

async function processPayment(p: Payment) {
  const data = await prisma.payment.create({
    data: {
      ticketId: p.ticketId,
      cardIssuer: p.issuer,
      cardLastDigits: p.cardNumber.slice(-4),
      value: p.price,
    },
  });

  await prisma.ticket.update({ where: { id: data.ticketId }, data: { status: "PAID" } });

  return data;
}

const paymentsRepository = { findWithTicketId, processPayment };

export default paymentsRepository;
