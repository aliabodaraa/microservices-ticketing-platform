"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { homePath, ticketsPath } from "@/paths";
import z from "zod";
import { buildClient } from "@/api/build-client";
import { headers } from "next/headers";

const createTicketSchema = z.object({
  title: z.string(),
  price: z.coerce.number().positive(),
});

export const createTicket = async (
  _actionState: ActionState,
  formData: FormData
) => {
  await getAuthOrRedirect();

  try {
    const { title, price } = createTicketSchema.parse(
      Object.fromEntries(formData)
    );
    const headersList = await headers();
    await buildClient({
      Cookie: headersList.get("cookie") || "",
      Authorization: headersList.get("authorization") || "",
    }).post("/api/tickets", {
      title,
      price,
    });
  } catch (error) {
    console.log(error, "=========");
    return fromErrorToActionState(error);
  }

  await setCookieByKey("toast", "Ticket created");
  return toActionState("SUCCESS", "", undefined);
};
