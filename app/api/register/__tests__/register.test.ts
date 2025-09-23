import { PrismaClient } from "@prisma/client";
import { POST } from "../route";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

describe("POST /api/register", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const requestBody = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    };

    const req = new NextRequest("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.user).toHaveProperty("id");
    expect(data.user.email).toBe(requestBody.email);

    // Clean up the created user
    await prisma.user.delete({ where: { id: data.user.id } });
  });

  it("should return 400 if email or password are not provided", async () => {
    const requestBody = {
      name: "Test User",
    };

    const req = new NextRequest("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email and password are required");
  });
});
