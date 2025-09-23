const mockUsers = [];

jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    user: {
      create: jest.fn().mockImplementation((data) => {
        const newUser = { id: String(mockUsers.length + 1), ...data.data };
        mockUsers.push(newUser);
        return Promise.resolve(newUser);
      }),
      findUnique: jest.fn().mockImplementation((query) => {
        const user = mockUsers.find((u) => u.email === query.where.email);
        return Promise.resolve(user);
      }),
      delete: jest.fn().mockImplementation((query) => {
        const index = mockUsers.findIndex((u) => u.id === query.where.id);
        if (index > -1) {
          mockUsers.splice(index, 1);
        }
        return Promise.resolve();
      }),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});
