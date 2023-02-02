import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createTicket,
  createTicketType,
  createTicketTypeOptions,
  createUser,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import { TicketStatus } from "@prisma/client";
import { createHotelWithRooms } from "../factories/hotels-factory";

const server = supertest(app);

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  cleanDb();
});

describe("GET /hotels", () => {
  it("Should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if token is not valid", async () => {
    const token = faker.lorem.word();
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/tickets/types").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with status 404 if user doesn't have an enrollment", async () => {
      const token = await generateValidToken();
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 404 if user doesn't have a ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 404 if there's no hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeOptions(false, true);
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 402 if ticket is not paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrolment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it("Should respond with status 402 if ticket type is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeOptions(true, true);
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it("Should respond with status 402 if ticket does not includes hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeOptions(false, false);
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it("Should respond with status 200 and hotel data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrolment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeOptions(false, true);
      await createTicket(enrolment.id, ticketType.id, TicketStatus.PAID);
      await createHotelWithRooms();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
    });
  });
});
