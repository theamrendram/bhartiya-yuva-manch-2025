"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <section className="flex items-center justify-between overflow-hidden text-white">
      <div className="relative z-10 w-full rounded-t-lg bg-gradient-to-b from-gray-800 via-gray-900 to-black p-4 text-white shadow-lg">
        <div className="mx-auto flex flex-col items-start justify-between">
          <div className="flex w-full items-center justify-center">
            <p className="mt-4 text-center text-4xl leading-relaxed font-bold text-gray-400 md:text-5xl">
              {" "}
              Summer School BVICAM
            </p>
          </div>
          <div className="mx-auto flex w-full flex-col items-start justify-between gap-4 md:w-1/2">
            <ul className="flex w-full justify-between gap-2">
              <li>
                <Link
                  href="#about"
                  className="text-gray-400 hover:text-gray-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#schedule"
                  className="text-gray-400 hover:text-gray-200"
                >
                  Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="#speakers"
                  className="text-gray-400 hover:text-gray-200"
                >
                  Speakers
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-400 hover:text-gray-200"
                >
                  Register Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Bharati Vidyapeeth&apos;s Institute of Computer Applications and Management */}
          <div className="w-full py-2 text-gray-400">
            <p className="text-center">
              BVICAM, A-4, Paschim Vihar, Opp. Paschim Vihar (East) Metro
              Station, Rohtak Road, New Delhi, Delhi 110063
            </p>
          </div>

          <div className="flex w-full flex-col items-center justify-between py-4 text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} BVICAM. All Rights Reserved.
            </p>

            <p className="text-gray-400">
              Designed and Developed by{" "}
              <a
                href="https://ananya-jain.vercel.app"
                className="text-gray-400 underline hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ananya Jain 
              </a>{" "}
              and{" "}
              <a
                href="https://amrendram.me"
                className="text-gray-400 underline hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                  Kumar Amrendram
              </a>
            </p>

            {/* Instagram follow section */}
            <div className="mt-2 flex items-center gap-2 text-gray-400">
              <a
                href="https://instagram.com/ieeebvicam"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 transition-colors duration-200 hover:text-pink-400 underline"
              >
                <svg
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.206.058 2.003.25 2.47.418a4.92 4.92 0 011.675 1.087 4.92 4.92 0 011.087 1.675c.168.467.36 1.264.418 2.47.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.058 1.206-.25 2.003-.418 2.47a4.92 4.92 0 01-1.087 1.675 4.92 4.92 0 01-1.675 1.087c-.467.168-1.264.36-2.47.418-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.206-.058-2.003-.25-2.47-.418a4.92 4.92 0 01-1.675-1.087 4.92 4.92 0 01-1.087-1.675c-.168-.467-.36-1.264-.418-2.47C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.058-1.206.25-2.003.418-2.47a4.92 4.92 0 011.087-1.675A4.92 4.92 0 015.413 2.65c.467-.168 1.264-.36 2.47-.418C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.736 0 8.332.013 7.052.072 5.775.13 4.692.362 3.79.675a7.089 7.089 0 00-2.58 1.684A7.089 7.089 0 00.675 4.938c-.313.902-.545 1.985-.603 3.262C.013 8.332 0 8.736 0 12s.013 3.668.072 4.948c.058 1.277.29 2.36.603 3.262a7.089 7.089 0 001.684 2.58 7.089 7.089 0 002.58 1.684c.902.313 1.985.545 3.262.603 1.28.059 1.684.072 4.948.072s3.668-.013 4.948-.072c1.277-.058 2.36-.29 3.262-.603a7.089 7.089 0 002.58-1.684 7.089 7.089 0 001.684-2.58c.313-.902.545-1.985.603-3.262.059-1.28.072-1.684.072-4.948s-.013-3.668-.072-4.948c-.058-1.277-.29-2.36-.603-3.262a7.089 7.089 0 00-1.684-2.58A7.089 7.089 0 0020.21.675c-.902-.313-1.985-.545-3.262-.603C15.668.013 15.264 0 12 0zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
                <span>Follow IEEE BVICAM</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p className="text-2xl font-medium">Contact Us:</p>
          <p className="text-base font-medium">
            Nidhi Gupta: +91-9211506201 | Ananya Jain: +91-8586078543 | Kumar
            Amrendram : +91-9625854106
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
