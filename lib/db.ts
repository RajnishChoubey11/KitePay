type DemoUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "COMPANY" | "EMPLOYEE";
  companyName?: string | null;
  walletAddress?: string | null;
};

const users: DemoUser[] = [
  {
    id: "company_demo",
    name: "KitePay Admin",
    email: "company@kitepay.demo",
    password: "demo123",
    role: "COMPANY",
    companyName: "KitePay Demo Co.",
  },
  {
    id: "employee_demo",
    name: "Priya Nair",
    email: "employee@kitepay.demo",
    password: "demo123",
    role: "EMPLOYEE",
    walletAddress: "5Nq...Sol",
  },
];

export const prisma = {
  user: {
    findUnique: async ({ where }: { where: { email?: string } }) => {
      return users.find((user) => user.email === where.email) ?? null;
    },
    create: async ({ data }: { data: Omit<DemoUser, "id"> }) => {
      const user = { ...data, id: `demo_${Date.now()}` };
      users.push(user);
      return user;
    },
  },
};
