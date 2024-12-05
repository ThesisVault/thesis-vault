import { roleRouter } from "@/modules/user/src/infrastructure/http/routes/roleRouter";
import { seedRole } from "@/modules/user/tests/utils/role/seedRole";
import { seedUser } from "@/modules/user/tests/utils/user/seedUser";
import { db } from "@/shared/infrastructure/database";
import { createCallerFactory } from "@/shared/infrastructure/trpc";
import { faker } from "@faker-js/faker";
import type { TRPCError } from "@trpc/server";

describe("getRoleByIdEndPoint", () => {
  describe("User is authenticated", () => {
    it("should return role when roleId exist", async () => {
      const seededAuthenticatedUser = await seedUser({});

      const seededRole = await seedRole({});
      const request = {
        roleId: seededRole.id,
      };

      const createdCaller = createCallerFactory(roleRouter);
      const caller = createdCaller({
        session: {
          user: {
            id: seededAuthenticatedUser.id,
          },
          expires: new Date().toString(),
        },
        db: db,
      });

      const roleDetails = await caller.getRoleById(request);

      expect(roleDetails).toBeDefined();
      expect(roleDetails!.id).toBe(seededRole.id);
    });

    it("should return null when roleId does not exist", async () => {
      const seededAuthenticatedUser = await seedUser({});

      const request = {
        roleId: "un-existing-id",
      };

      const createdCaller = createCallerFactory(roleRouter);
      const caller = createdCaller({
        session: {
          user: {
            id: seededAuthenticatedUser.id,
          },
          expires: new Date().toString(),
        },
        db: db,
      });

      const roleDetails = await caller.getRoleById(request);

      expect(roleDetails).toBeNull();
    });
  });

  describe("User is unauthenticated", () => {
    it("should return an unauthorized error if user is not authenticated", async () => {
      const seededRole = await seedRole({});
      const request = {
        roleId: faker.string.uuid(),
        name: seededRole.name,
      };

      const createdCaller = createCallerFactory(roleRouter);
      const caller = createdCaller({
        session: null,
        db: db,
      });

      let errorMessage = "";
      try {
        await caller.getRoleById(request);
      } catch (error) {
        errorMessage = (error as TRPCError).message;
      }

      expect(errorMessage).toBe("UNAUTHORIZED");
    });
  });
});
