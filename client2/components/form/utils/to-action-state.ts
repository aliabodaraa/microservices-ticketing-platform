import { ZodError } from "zod";

export type ActionState<T = any> = {
  status?: "SUCCESS" | "ERROR";
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
  timestamp: number;
  data?: T;
};

export const EMPTY_ACTION_STATE: ActionState = {
  message: "",
  fieldErrors: {},
  timestamp: Date.now(),
};

export const fromErrorToActionState = (
  error: unknown,
  formData?: FormData
): ActionState => {
  let _error: ActionState = {
    status: "ERROR",
    message: "An unknown error occurred",
    payload: formData,
    fieldErrors: {},
    timestamp: Date.now(),
  };
  if (error instanceof ZodError) {
    _error = {
      ..._error,
      message: "",
      fieldErrors: error.flatten().fieldErrors,
    };
  } else if (error instanceof Error)
    _error = { ..._error, message: error.message };
  else if (Array.isArray(error))
    _error = { ..._error, message: error[0]?.message };
  return _error;
};

export const toActionState = (
  status: ActionState["status"],
  message: string,
  formData?: FormData,
  data?: unknown
): ActionState => ({
  status,
  message,
  fieldErrors: {},
  payload: formData,
  timestamp: Date.now(),
  data,
});
