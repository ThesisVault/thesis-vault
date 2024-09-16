import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authConfig } from "../src/shared/infrastructure/authentication/config";
import { getServerAuthSession } from "../src/shared/infrastructure/authentication/index";

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
			expect(session).toEqual(mockUseSession);
		});

		it("should return unauthenticated result if no session", () => {
			const mockUseSession = {
				data: null,
				status: "unauthenticated",
			};

			(useSession as jest.Mock).mockReturnValueOnce(mockUseSession);

			const session = useSession();

			expect(useSession).toHaveBeenCalled();
			expect(session).toEqual(mockUseSession);
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
			expect(session).toEqual(mockSession);
		});

		it("should return null if no session", async () => {
			(getServerSession as jest.Mock).mockResolvedValueOnce(null);

			const session = await getServerAuthSession();

			expect(getServerSession).toHaveBeenCalledWith(authConfig);
			expect(session).toBeNull();
		});
	});
});
