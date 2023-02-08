import app, { init } from "@/app";

import { faker } from "@faker-js/faker";
import supertest from "supertest";
import httpStatus from "http-status";

import {
  createHotel,
  createUser,
  createRoomWithHotelId,
  createTicket,
  createTicketTypeWithHotel,
  createEnrollmentWithAddress,
  createTicketTypeRemote,
  createTicketTypeWithoutHotel,
} from "../factories";
import * as jwt from "jsonwebtoken";

import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";
import { createBooking, createBookingWithRoomFull } from "../factories/booking-factory";
import { prisma } from "@/config";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/enrollments");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/enrollments").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/enrollments").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with status 404 if user doesn't have a ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.post("/booking").send({ roomId: 1 }).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });

    it("Should respond with status 402 if ticket is not paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrolment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.post("/booking").send({ roomId: 1 }).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it("Should respond with status 402 if ticket type is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.post("/booking").send({ roomId: 1 }).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it("Should respond with status 402 if ticket does not includes hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithoutHotel();
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.post("/booking").send({ roomId: 1 }).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it("Should respond with status 404 when room id is invalid", async () => {
      const token = await generateValidToken();
      const hotel = await createHotel();
      await createRoomWithHotelId(hotel.id);
      const response = await server.post("/booking").send({ roomId: -1 }).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });

    it("Should respond with status 403 when room is already full", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createBookingWithRoomFull(hotel.id);

      const response = await server.post("/booking").send({ roomId: room.id }).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(403);
    });

    it("Should respond with status 200 and booking id", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const response = await server.post("/booking").send({ roomId: room.id }).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/enrollments");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/enrollments").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/enrollments").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with status 404 if user has no booking", async () => {
      const token = await generateValidToken();
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("Should respond with status 200 and booking info", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: booking.id,
        Room: expect.objectContaining({
          ...room,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        }),
      });
    });
  });
});

describe("PUT /booking/:bookingId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/enrollments");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/enrollments").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/enrollments").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should respond with status 422 when roomId is not sent or invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`).send({ roomId: "" });

      expect(response.status).toBe(422);
    });

    it("should respond with status 404 when roomId does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ roomId: -1 });

      expect(response.status).toBe(404);
    });

    it("Should respond with status 404 when bookingId doesn't exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const response = await server
        .put("/booking/-1")
        .send({ roomId: room.id })
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("Should respond with status 403 when room is already full", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const fullRoom = await createBookingWithRoomFull(hotel.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .send({ roomId: fullRoom.id })
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it("Should respond with status 401 when the user does not own the booking id", async () => {
      const otherUser = await createUser();
      const user = await createUser();

      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const otherUserBooking = await createBooking(otherUser.id, room.id);
      await createBooking(user.id, room.id);

      const response = await server
        .put(`/booking/${otherUserBooking.id}`)
        .send({ roomId: room.id })
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(401);
    });

    it("Should respond with status 200 and booking id", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);

      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const newRoom = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .send({ roomId: newRoom.id })
        .set("Authorization", `Bearer ${token}`);

      const dataIsRecorded = await prisma.booking.findUnique({
        where: { id: response.body.bookingId },
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });

      expect(dataIsRecorded).toBeTruthy();
    });
  });
});
