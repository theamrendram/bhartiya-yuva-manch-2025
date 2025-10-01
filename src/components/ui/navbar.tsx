"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { href: "#hero", title: "Home" },
  { href: "#about", title: "About" },
  { href: "#gallery", title: "Gallery" },
  { href: "#speakers", title: "Speakers" },
  { href: "#guidelines", title: "Guidelines" },
  { href: "#schedule", title: "Schedule" },
  { href: "#faq", title: "FAQ" },
  { href: "#venue", title: "Venue" },
];

export function Navbar({
  onToggleTheme,
  isDark,
}: {
  onToggleTheme?: () => void;
  isDark?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.nav
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-x-0 top-4 mx-auto flex max-w-4xl items-center justify-between rounded-full border px-3 py-2 sm:px-4 z-50 shadow-lg
        bg-white/80 border-gray-200 text-neutral-800 backdrop-blur-md
        dark:bg-black/80 dark:border-gray-700/30 dark:text-neutral-100">
      <Link href={"/"}>
        <Image
          className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700"
          src="/avatar.jpeg"
          height={40}
          width={40}
          alt="avatar"
        />
      </Link>
      <div className="flex items-center">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            className="relative px-2 py-1 text-sm font-medium transition-colors duration-200
              text-neutral-700 hover:text-primary
              dark:text-neutral-300 dark:hover:text-blue-300"
            href={item.href}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}>
            {hovered === idx && (
              <motion.span
                layoutId="hovered-span"
                className="absolute inset-0 h-full w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.title}</span>
          </Link>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <Link
          href="/login"
          className="hoverable px-4 py-2 rounded-md border border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors shadow-sm
            dark:border-blue-400 dark:text-blue-200 dark:bg-black dark:hover:bg-blue-700 dark:hover:text-white">
          Login
        </Link>
        <Link
          href="/register"
          className="hoverable px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors shadow-md
            dark:bg-gradient-to-r dark:from-blue-600 dark:via-blue-600 dark:to-blue-800 dark:hover:bg-blue-700">
          Register
        </Link>
        <motion.button
          aria-label="Toggle theme"
          onClick={onToggleTheme}
          className="ml-4 p-2 rounded-full border border-transparent bg-neutral-100 hover:bg-neutral-200 transition-colors shadow
            dark:bg-neutral-900 dark:hover:bg-neutral-800"
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-blue-900" />
          )}
        </motion.button>
      </div>
    </motion.nav>
  );
}
