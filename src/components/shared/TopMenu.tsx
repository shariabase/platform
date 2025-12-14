import { useMemo, useState } from 'react';

type TopMenuItem = {
  label: string;
  href: string;
};

const menuItems: TopMenuItem[] = [
  { label: 'Startups', href: '#' },
  { label: 'Enterprise', href: '#' },
  { label: 'Templates', href: '#' },
  { label: 'Scholars', href: '#' },
  { label: 'Tools', href: '#' },
  { label: 'Help', href: '#' },
];

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 20a2 2 0 0 1-4 0m9-5V11a7 7 0 1 0-14 0v4l-2 2h18l-2-2Z"
      />
    </svg>
  );
}

function ShariabaseMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <defs>
        <radialGradient id="g" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(26 18) rotate(55) scale(48)">
          <stop stopColor="#E7FBCF" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#B7FF76" stopOpacity="0.35" />
          <stop offset="1" stopColor="#0B0F18" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#g)" />
      <path
        d="M32 12c10.5 0 20 6.6 20 18.5S42.5 52 32 52 12 44.4 12 30.5 21.5 12 32 12Z"
        stroke="rgba(255,255,255,0.20)"
      />
      <path
        d="M18 34c6-8 10-14 14-14s8 6 14 14"
        stroke="rgba(255,255,255,0.28)"
        strokeLinecap="round"
      />
      <path
        d="M18 38c6-8 10-14 14-14s8 6 14 14"
        stroke="rgba(255,255,255,0.16)"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TopMenu() {
  const [active, setActive] = useState('Startups');
  const activeHref = useMemo(() => menuItems.find((i) => i.label === active)?.href ?? '#', [active]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-950/60 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-6xl items-center gap-6 px-6">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3">
          <span className="relative inline-flex h-10 w-10 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-white/10 blur-md" />
            <ShariabaseMark className="relative h-10 w-10" />
          </span>
          <span className="text-[22px] font-semibold tracking-tight text-white">Shariabase</span>
        </a>

        {/* Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {menuItems.map((item) => {
            const isActive = item.label === active;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(item.label);
                }}
                className={
                  'text-[15px] font-medium transition-colors ' +
                  (isActive ? 'text-accent-500' : 'text-white/60 hover:text-white/85')
                }
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Search */}
          <label className="relative hidden w-[340px] items-center md:flex">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              type="search"
              placeholder="Search..."
              className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white/80 placeholder:text-white/30 outline-none ring-0 transition focus:border-white/15 focus:bg-white/7"
            />
          </label>

          {/* Icons */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <BellIcon className="h-[18px] w-[18px]" />
          </button>

          {/* Avatar */}
          <a
            href={activeHref}
            className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(183,255,118,0.35),rgba(255,255,255,0.06)_35%,rgba(255,255,255,0)_70%)]"
            aria-label="Profile"
            title="Profile"
          >
            <span className="text-xs font-semibold text-white/80">SB</span>
          </a>
        </div>
      </div>
    </header>
  );
}
