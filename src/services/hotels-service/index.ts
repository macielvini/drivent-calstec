import { hotelRepository } from "@/repositories/hotel-repository";

async function findAll() {
  return await hotelRepository.findAll();
}

export const hotelServices = { findAll };
