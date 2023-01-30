import joi from "joi";

export const paymentSchema = joi.object({
  ticketId: joi.number().required(),
  cardData: {
    issuer: joi.string().required(),
    number: joi.string().required(),
    name: joi.string(),
    expirationData: joi.string().required(),
    cvv: joi.string().required(),
  },
});
