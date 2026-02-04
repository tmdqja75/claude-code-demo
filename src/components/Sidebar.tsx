"use client";

import { useState } from "react";
import { FiHome, FiDatabase, FiMail, FiX } from "react-icons/fi";
import type { IconType } from "react-icons";

interface MenuItem {
  id: string;
  label: string;
  icon: IconType;
}

const MENU_ITEMS: MenuItem[] = [
  { id: "home", label: "홈", icon: FiHome },
  { id: "data", label: "데이터", icon: FiDatabase },
  { id: "contact", label: "문의하기", icon: FiMail },
];

export default function Sidebar() {
  const [activeId, setActiveId] = useState<string>("home");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 bg-white fixed left-0 top-0 z-10">
        {/* Logo area */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-black">Logo</h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-20 flex flex-col gap-1.5 p-2"
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-black rounded" />
        <span className="block w-5 h-0.5 bg-black rounded" />
        <span className="block w-5 h-0.5 bg-black rounded" />
      </button>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer panel */}
          <div className="w-64 h-screen bg-white shadow-xl flex flex-col animate-[slideIn_0.2s_ease-out]">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h1 className="text-lg font-semibold text-black">Logo</h1>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 flex flex-col gap-1">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveId(item.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-black text-white"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
