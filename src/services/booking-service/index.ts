import bookingRepository from "@/repositories/booking-repository";
import { Booking } from "@prisma/client";

async function createOne(userId: number, roomId: number): Promise<Booking> {
  return await bookingRepository.createOne({ userId, roomId });
}

const bookingService = { createOne };
export default bookingService;
