declare module "#auth-utils" {
  interface User {
    id: string;
    email: string;
    name: string | null;
    role: "FARMER" | "ADMIN";
  }
}

export {};
