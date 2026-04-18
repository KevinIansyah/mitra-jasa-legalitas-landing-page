"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({
  to,
  duration = 2,
  suffix = "",
  prefix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const runAnimation = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!Number.isFinite(to) || to <= 0) {
      setCount(to || 0);
      return;
    }

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(to * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCount(to);
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [to, duration]);

  useEffect(() => {
    if (isInView) runAnimation();
  }, [isInView, runAnimation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      runAnimation();
    }, 800);
    return () => clearTimeout(timer);
  }, [runAnimation]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}
