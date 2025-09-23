import { PrismaClient } from "@prisma/client";
import { POST as registerPOST } from "../../register/route";
import { POST as loginPOST } from "../route";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

describe("POST /api/login", () => {
  let user: any;

  beforeAll(async () => {
    // Create a user to be used for login tests
    const requestBody = {
      email: "login@example.com",
      password: "password123",
      name: "Login User",
    };

    const req = new NextRequest("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await registerPOST(req);
    const data = await response.json();
    user = data.user;
  });

  afterAll(async () => {
    // Clean up the created user and disconnect from the database
    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
    }
    await prisma.$disconnect();
  });

  it("should login a user and return a token", async () => {
    const requestBody = {
      email: "login@example.com",
      password: "password123",
    };

    const req = new NextRequest("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await loginPOST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("token");
    expect(data.user.email).toBe(requestBody.email);
  });

  it("should return 401 for invalid credentials", async () => {
    const requestBody = {
      email: "login@example.com",
      password: "wrongpassword",
    };

    const req = new NextRequest("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await loginPOST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid credentials");
  });
});
