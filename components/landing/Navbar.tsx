"use client";

import Logo from "../shared/Logo";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 z-50 w-[92%] max-w-7xl -translate-x-1/2">

      <div
        className="
        flex
        items-center
        justify-between
        rounded-full
        border
        border-white/10
        bg-white/[0.03]
        px-8
        py-4
        backdrop-blur-xl
        "
      >

        <Logo />

        <div className="hidden items-center gap-10 text-sm text-zinc-400 md:flex">

          <a
            href="#"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#"
            className="transition hover:text-white"
          >
            AI
          </a>

          <a
            href="#"
            className="transition hover:text-white"
          >
            Docs
          </a>

          <a
            href="#"
            className="transition hover:text-white"
          >
            Pricing
          </a>

        </div>

        <AuthButtons />

      </div>

    </nav>
  );
}