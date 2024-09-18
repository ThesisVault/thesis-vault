import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authConfig } from "../config";
import { getServerAuthSession } from "../index";

jest.mock("next-auth", () => ({
	getServerSession: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
	useSession: jest.fn(),
}));

describe("Authentication Tests", () => {
	describe("Client Side", () => {
		it("should return the session from useSession", () => {
			const mockUseSession = {
				data: {
					user: {
						name: "John Doe",
						email: "john.doe@neu.edu.ph",
						image: "https://example.com/image.jpg",
					},
					expires: "some-future-date",
				},
				status: "authenticated",
			};

			(useSession as jest.Mock).mockReturnValueOnce(mockUseSession);

			const session = useSession();

			expect(useSession).toHaveBeenCalled();
			expect(session.data?.user.name).toEqual("John Doe");
			expect(session.data?.user.email).toEqual("john.doe@neu.edu.ph");
			expect(session.data?.user.image).toEqual("https://example.com/image.jpg");
			expect(session.data?.expires).toEqual("some-future-date");
			expect(session.status).toEqual("authenticated");
		});

		it("should return unauthenticated result if no session", () => {
			const mockUseSession = {
				data: null,
				status: "unauthenticated",
			};

			(useSession as jest.Mock).mockReturnValueOnce(mockUseSession);

			const session = useSession();

			expect(useSession).toHaveBeenCalled();
			expect(session.data).toBeNull();
			expect(session.status).toEqual("unauthenticated");
		});
	});

	describe("Server Side", () => {
		it("should return a valid session", async () => {
			const mockSession = {
				user: {
					id: "user-id",
					name: "John Doe",
					email: "johndoe@example.com",
				},
			};

			(getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);

			const session = await getServerAuthSession();

			expect(getServerSession).toHaveBeenCalledWith(authConfig);
			expect(session?.user.id).toEqual("user-id");
			expect(session?.user.name).toEqual("John Doe");
			expect(session?.user.email).toEqual("johndoe@example.com");
		});

		it("should return null if no session", async () => {
			(getServerSession as jest.Mock).mockResolvedValueOnce(null);

			const session = await getServerAuthSession();

			expect(getServerSession).toHaveBeenCalledWith(authConfig);
			expect(session).toBeNull();
		});
	});
});
