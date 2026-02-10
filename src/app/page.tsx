"use client";

import { useState, useRef, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const LENGTH = 12;
const SPIN_INTERVAL_MS = 60;
const SETTLE_DELAY_MS = 120; // stagger between each character settling

function randomChar(): string {
  return CHARS.charAt(Math.floor(Math.random() * CHARS.length));
}

function generateRandomString(): string {
  return Array.from({ length: LENGTH }, randomChar).join("");
}

export default function Home() {
  const [displayed, setDisplayed] = useState("");
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const settledRef = useRef<number>(LENGTH); // how many chars have settled (from left)
  const targetRef = useRef<string>("");

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const handleGenerate = useCallback(() => {
    stopAnimation();

    const target = generateRandomString();
    targetRef.current = target;
    settledRef.current = 0;

    // Schedule each character to lock in, left to right
    for (let i = 0; i < LENGTH; i++) {
      setTimeout(() => {
        settledRef.current = i + 1;
      }, SETTLE_DELAY_MS * (i + 1));
    }

    // Stop spinning after all characters have settled
    setTimeout(() => {
      stopAnimation();
      setDisplayed(target);
    }, SETTLE_DELAY_MS * LENGTH + SPIN_INTERVAL_MS);

    // Spin loop: each tick regenerates only the unsettled portion
    animationRef.current = setInterval(() => {
      const settled = settledRef.current;
      const prefix = targetRef.current.slice(0, settled);
      const spinning = Array.from({ length: LENGTH - settled }, randomChar).join("");
      setDisplayed(prefix + spinning);
    }, SPIN_INTERVAL_MS);
  }, [stopAnimation]);

  const handleCall = useCallback(async () => {
    stopAnimation();

    try {
      const response = await fetch("/api/call");
      const data = await response.json();
      setDisplayed(data);
    } catch (error) {
      console.error("Failed to fetch from API:", error);
    }
  }, [stopAnimation]);

  return (
    <div className="h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-lg flex flex-col gap-4">
        <input
          type="text"
          value={displayed}
          readOnly
          placeholder="Random string will appear here"
          className="w-full rounded-full bg-gray-300 text-black placeholder-black/50 px-6 py-4 text-lg outline-none font-mono tracking-widest"
        />
        <button
          onClick={handleGenerate}
          className="w-full rounded-full bg-black text-white px-6 py-4 text-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Generate
        </button>
        <button
          onClick={handleCall}
          className="w-full rounded-full bg-black text-white px-6 py-4 text-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Call
        </button>
      </div>
    </div>
  );
}
