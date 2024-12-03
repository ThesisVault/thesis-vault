import { TRPCError } from "@trpc/server";

export class NotFoundError extends TRPCError {
	constructor(message: string) {
		super({ message, code: "NOT_FOUND" });
	}
}

export class BadRequestError extends TRPCError {
	constructor(message: string) {
		super({ message, code: "BAD_REQUEST" });
	}
}

export class UnexpectedError extends TRPCError {
	constructor(message: string) {
		super({ message, code: "INTERNAL_SERVER_ERROR" });
	}
}

export class ForbiddenError extends TRPCError {
  constructor(message: string) {
    super({ message, code: "FORBIDDEN" });
  }
}
