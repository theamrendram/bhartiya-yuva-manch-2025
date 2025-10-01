"use client";
import React from "react";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

function AppShell({ children }: { children: React.ReactNode }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <>
      <Navbar onToggleTheme={toggleTheme} isDark={isDark} />
      <main className="mx-auto">{children}</main>
    </>
  );
}

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AppShell>{children}</AppShell>
    </ThemeProvider>
  );
}
