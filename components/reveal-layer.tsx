"use client";

import { useEffect, useRef, useState } from "react";

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
  spotlightRadius?: number;
}

export function RevealLayer({
  image,
  cursorX,
  cursorY,
  spotlightRadius = 260,
}: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maskDataUrl, setMaskDataUrl] = useState<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.width || !canvas.height) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (cursorX !== -999 && cursorY !== -999) {
      // Build radial gradient at (cursorX, cursorY) from radius 0 -> spotlightRadius
      const gradient = ctx.createRadialGradient(
        cursorX,
        cursorY,
        0,
        cursorX,
        cursorY,
        spotlightRadius
      );

      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.4, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.75)");
      gradient.addColorStop(0.75, "rgba(255, 255, 255, 0.4)");
      gradient.addColorStop(0.88, "rgba(255, 255, 255, 0.12)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, spotlightRadius, 0, Math.PI * 2);
      ctx.fill();

      setMaskDataUrl(canvas.toDataURL());
    } else {
      setMaskDataUrl("");
    }
  }, [cursorX, cursorY, spotlightRadius]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: "none" }}
      />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskImage: maskDataUrl ? `url(${maskDataUrl})` : "none",
          WebkitMaskImage: maskDataUrl ? `url(${maskDataUrl})` : "none",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      />
    </>
  );
}
