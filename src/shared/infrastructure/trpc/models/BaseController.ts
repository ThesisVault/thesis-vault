import { TRPCError } from "@trpc/server";

export abstract class BaseController<IRequest> {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	protected abstract executeImpl(request: IRequest): Promise<any>;

	public ok<T>(dto: T) {
		return dto;
	}

	public badRequest(message: string) {
		throw new TRPCError({ code: "BAD_REQUEST", message });
	}

	public notFound(message: string) {
		throw new TRPCError({ code: "NOT_FOUND", message });
	}
}
