"use client";

import type { HomeServiceSummary } from "@/lib/types/home";
import { MarqueeRow, type MarqueeItem } from "./marque-row";

function marqueeItemsFromAllServices(allServices: HomeServiceSummary[]): MarqueeItem[] {
  return allServices.map((service) => ({
    icon: service.icon?.trim() || "📋",
    label: service.name,
    href: `/layanan/${service.slug}`,
  }));
}

function splitIntoTwoRows(items: MarqueeItem[]): { rowOne: MarqueeItem[]; rowTwo: MarqueeItem[] } {
  if (items.length === 0) {
    return { rowOne: [], rowTwo: [] };
  }
  const mid = Math.ceil(items.length / 2);
  const rowOne = items.slice(0, mid);
  let rowTwo = items.slice(mid);
  if (rowTwo.length === 0) {
    rowTwo = rowOne;
  }
  return { rowOne, rowTwo };
}

type ClientMarqueeProps = {
  allServices?: HomeServiceSummary[] | null;
};

export function ClientMarquee({ allServices }: ClientMarqueeProps) {
  if (!Array.isArray(allServices) || allServices.length === 0) {
    return null;
  }

  const fromApi = marqueeItemsFromAllServices(allServices);
  const { rowOne, rowTwo } = splitIntoTwoRows(fromApi);

  return (
    <section className="relative overflow-hidden bg-surface-page">
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div
        style={{
          transform: "skewY(-1deg)",
          margin: "0 -40px",
        }}
      >
        <div className="flex flex-col gap-2">
          <MarqueeRow items={rowOne} direction="left" speed={40} />
          <MarqueeRow items={rowTwo} direction="right" speed={33} />
        </div>
      </div>
    </section>
  );
}
