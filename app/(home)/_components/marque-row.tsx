import Link from 'next/link';

export type MarqueeItem = {
  icon: string;
  label: string;
  href?: string;
};

const chipClassName =
  'inline-flex items-center gap-2 px-6 py-4 rounded-xl whitespace-nowrap text-sm font-medium shrink-0 transition-all hover:scale-105';

const chipStyle = {
  background:
    'linear-gradient(135deg, oklch(0.3811 0.1315 260.22 / 0.12), oklch(0.7319 0.1856 52.89 / 0.12))',
} as const;

export function MarqueeRow({
  items,
  direction = 'left',
  speed = 35,
}: {
  items: MarqueeItem[];
  direction?: 'left' | 'right';
  speed?: number;
}) {
  const doubled = [...items, ...items, ...items];

  return (
    <div
      className="relative flex overflow-hidden py-1"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        className="flex gap-3 shrink-0"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {doubled.map((item, i) => {
          const inner = (
            <>
              {/* <span style={{ fontSize: 15 }}>{item.icon}</span> */}
              {item.label}
            </>
          );
          return item.href ? (
            <Link
              key={`${item.href}-${i}`}
              href={item.href}
              prefetch={false}
              className={`${chipClassName} cursor-pointer text-inherit no-underline`}
              style={chipStyle}
            >
              {inner}
            </Link>
          ) : (
            <div
              key={`${item.label}-${i}`}
              className={`${chipClassName} cursor-default`}
              style={chipStyle}
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
