"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

const navItems = [
  { href: "/#hero", title: "Home" },
  { href: "/#about", title: "About" },
  { href: "/#gallery", title: "Gallery" },
  { href: "/#speakers", title: "Speakers" },
  { href: "/#guidelines", title: "Guidelines" },
  { href: "/#schedule", title: "Schedule" },
  { href: "/#faq", title: "FAQ" },
  { href: "/#venue", title: "Venue" },
  { href: "/#contact", title: "Contact Us" },
];

export function Navbar({
  onToggleTheme,
  isDark,
}: {
  onToggleTheme?: () => void;
  isDark?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 100], [0, 10]);
  const width = useTransform(scrollY, [0, 100], ["100%", "90%"]);

  const [scrolled, setScrolled] = useState<boolean>(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <motion.nav
      style={{
        boxShadow: scrolled ? "var(--shadow-aceternity)" : "none",
        width,
        y,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="bg-opacity-10 fixed inset-x-0 top-4 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/20 bg-white/80 px-3 py-2 backdrop-blur-md sm:px-4 dark:border-gray-700/30 dark:bg-black/80 z-50">
      <Link href={"/"}>
        <Image
          className="h-10 w-10 rounded-full"
          src="/bvicam.png"
          height={40}
          width={40}
          alt="avatar"
        />
      </Link>
      <div className="flex items-center">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            className="relative px-2 py-1 text-sm text-neutral-700 dark:text-neutral-300"
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
          className="hoverable px-4 py-1.5 rounded-md bg-primary text-white hover:bg-primary-hover dark:bg-gradient-to-r dark:from-blue-600 dark:via-blue-600 dark:to-blue-800 dark:hover:bg-blue-700 transition-colors shadow-md">
          Login
        </Link>
        <motion.button
          aria-label="Toggle theme"
          onClick={onToggleTheme}
          className="ml-4 p-2 rounded-full border border-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors shadow"
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
