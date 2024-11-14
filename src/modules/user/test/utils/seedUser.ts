import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { PermissionsBits, Roles } from "@/modules/user/src/domain/models/user/permission/constant";
import { db } from "@/shared/infrastructure/database";
import type { User as UserPersistence } from "@prisma/client"

export const seedUser = async ({
    id = uuid(),
    name = faker.person.fullName(),
    email = faker.internet.email(),
    emailVerified = null,
    image = faker.image.url(),
    role = faker.helpers.arrayElement(Object.values(Roles)),
    permissions = faker.number.int({ min: 0, max: PermissionsBits.ALL, multipleOf: 2 }),
    createdAt = faker.date.past(),
    updatedAt = faker.date.past(),
  }: Partial<UserPersistence>): Promise<UserPersistence> => {
  const mockUserData = {
    id,
    name,
    email,
    emailVerified,
    image,
    role,
    permissions,
    createdAt,
    updatedAt,
  }
  
  return db.user.create({
    data: mockUserData
  })
}
