declare module "#auth-utils" {
  interface User {
    id: number;
    email: string;
    name: string | null;
    role: "FARMER" | "ADMIN";
  }
}

export {};
