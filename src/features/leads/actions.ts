"use server";

import { clientIp } from "@/lib/security/client-ip";
import { submitContact, submitProposal } from "./service";

/** Public form endpoints. All validation and spam checks happen on the server. */
export async function sendContactAction(input: unknown) {
  return submitContact(input, await clientIp());
}

export async function sendProposalAction(input: unknown) {
  return submitProposal(input, await clientIp());
}
