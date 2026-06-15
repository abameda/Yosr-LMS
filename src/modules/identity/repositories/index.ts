import "server-only";

import { database } from "@/lib/database/client";
import { createLearnerProfileRepository } from "@/modules/identity/repositories/learner-profile-repository";
import { createUserRepository } from "@/modules/identity/repositories/user-repository";

export const userRepository = createUserRepository(database);
export const learnerProfileRepository =
  createLearnerProfileRepository(database);
