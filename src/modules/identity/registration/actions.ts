"use server";

import { registerCustomer } from "@/modules/identity/registration/register-customer";
import type { RegistrationState } from "@/modules/identity/registration/registration-state";

export async function registerCustomerAction(
  previousState: RegistrationState,
  formData: FormData,
) {
  return registerCustomer(previousState, formData);
}
