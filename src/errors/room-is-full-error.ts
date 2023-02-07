import { ApplicationError } from "@/protocols";

export function roomIsFullError(): ApplicationError {
  return {
    name: "RoomIsFullError",
    message: "The room you selected is full",
  };
}
