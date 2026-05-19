import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { GiPortal } from "react-icons/gi";
import { IoSearch, IoList } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Rick & Morty - Wiki",
  description: "Explora el multiverso de Rick and Morty",
};

interface CharactersLayoutProps {
  children: ReactNode;
}

export default function CharactersLayout({ children }: CharactersLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-emerald-950 to-slate-950 text-white">
      <nav className="bg-black/40 backdrop-blur-sm sticky top-0 z-50 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Link
            href="/characters"
            className="text-2xl font-bold inline-flex items-center gap-2 hover:text-emerald-300 transition"
          >
            <GiPortal size={32} className="text-emerald-400" />
            R&amp;M Wiki
          </Link>

          <div className="flex gap-2 sm:gap-4 text-sm sm:text-base">
            <Link
              href="/characters"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-md hover:bg-emerald-500/20 transition"
            >
              <IoList /> Lista
            </Link>
            <Link
              href="/characters/search"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-md hover:bg-emerald-500/20 transition"
            >
              <IoSearch /> Buscar
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-md hover:bg-emerald-500/20 transition"
            >
              ← Home
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
