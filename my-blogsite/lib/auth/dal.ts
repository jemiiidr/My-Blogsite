import "server-only";

import { cache } from "react";

import { readSessionUser } from "@/lib/auth/session";

export const getCurrentUser = cache(async () => readSessionUser());
