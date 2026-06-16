import type { RegistrationFieldErrors } from "./registration-schema";

export type RegistrationState = {
  status: "idle" | "invalid" | "existing_email" | "error" | "success";
  message?: string;
  fieldErrors: RegistrationFieldErrors;
};

export const initialRegistrationState: RegistrationState = {
  status: "idle",
  fieldErrors: {},
};
