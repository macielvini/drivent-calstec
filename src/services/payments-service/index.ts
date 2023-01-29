import { notFoundError } from "@/errors";
import paymentsRepository from "@/repositories/payments-repository";

async function getPaymentWithTicketId(id: number) {
  const data = await paymentsRepository.findWithTicketId(id);

  if (!data || !data.id) throw notFoundError();

  return data;
}

const paymentsServices = { getPaymentWithTicketId };
export default paymentsServices;
