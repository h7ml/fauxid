"use client";

import { ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  // With Supabase Auth, we don't need a client-side provider
  // Session is managed entirely through cookies
  return <>{children}</>;
} 
