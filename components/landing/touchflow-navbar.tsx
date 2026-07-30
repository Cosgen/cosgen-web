"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";

interface TouchFlowNavbarProps {
  onOrderClick: () => void;
  onSlotClick: () => void;
}

const NAV_LINKS = [
  { label: "Portofolio", hash: "#portfolio" },
  { label: "Paket", hash: "#pricelist" },
  { label: "FAQ", hash: "#faq" },
];

export function TouchFlowNavbar({ onOrderClick, onSlotClick }: TouchFlowNavbarProps) {
  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) { el.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", hash); }
  };

  // NOTE: The hero already renders its own full desktop navbar overlay.
  // TouchFlowNavbar is used on non-hero pages or can be hidden on the landing page.
  // On landing (/), the hero's own nav is used. This component is kept for other pages.
  return null;
}
