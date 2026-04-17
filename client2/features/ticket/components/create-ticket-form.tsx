"use client";

import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTicket } from "../actions/create-ticket";
import { Ticket } from "../model.type";

type TicketCreationProps = {
  ticket?: Ticket;
};

const TicketCreation = ({ ticket }: TicketCreationProps) => {
  const [actionState, action] = useActionState(
    createTicket,
    EMPTY_ACTION_STATE
  );
  const handleSuccess = () => {};
  return (
    <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
      <Label htmlFor="title">Title</Label>
      <Input
        name="title"
        type="text"
        defaultValue={
          (actionState.payload?.get("title") as string) ?? ticket?.title
        }
      />
      <FieldError actionState={actionState} name="title" />

      <Label htmlFor="price">Price</Label>
      <Input
        name="price"
        type="number"
        defaultValue={
          (actionState.payload?.get("price") as string) ?? ticket?.price
        }
      />
      <FieldError actionState={actionState} name="price" />

      <SubmitButton label={"Create"} />
    </Form>
  );
};

export { TicketCreation };
