import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../../context/theme/ThemeContext";
import AppNavbar from "./AppNavbar";

export default function AppShell() {
  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <AppNavbar />
        <main className="w-full pt-2">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}