// src/components/SessionProviderWrapper.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth"; // ✅ import proper type
import React from "react";

interface Props {
  children: React.ReactNode;
  session?: Session; // properly typed
}

export default function SessionProviderWrapper({ children, session }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
