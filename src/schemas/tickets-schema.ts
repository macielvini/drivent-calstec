import joi from "joi";

export const ticketSchema = joi.object({
  ticketTypeId: joi.number().required(),
});
