/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Menu,
  X,
  Building2,
  FileText,
  Shield,
  Award,
  Gavel,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import navLogo from '@/public/nav-logo.svg';
import Image from 'next/image';
import { NavigationData } from '@/lib/types/navigation';

const BRAND = 'oklch(0.3811 0.1315 260.22)';

const CATEGORY_ICONS = [
  Building2,
  FileText,
  Shield,
  Award,
  Gavel,
  HelpCircle,
] as const;

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === 'dark';
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle dark mode"
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
    >
      {isDark ? (
        <Sun className="w-4.5 h-4.5" />
      ) : (
        <Moon className="w-4.5 h-4.5" />
      )}
    </button>
  );
}

interface NavbarProps {
  navigation: NavigationData;
}

export function Navbar({ navigation }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const serviceCategories = React.useMemo(
    () => navigation.service_categories ?? [],
    [navigation.service_categories],
  );

  React.useEffect(() => {
    setActiveCategoryId((prev) => {
      if (prev != null && serviceCategories.some((c) => c.id === prev)) {
        return prev;
      }
      return serviceCategories[0]?.id ?? null;
    });
  }, [serviceCategories]);

  const activeCategory =
    serviceCategories.find((c) => c.id === activeCategoryId) ??
    serviceCategories[0];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Image
              src={navLogo}
              alt="Logo Mitra Jasa Legalitas"
              height={40}
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="bg-gray-100/70 dark:bg-white/8 rounded-full px-2 py-1.5 gap-0.5">
                <NavigationMenuItem>
                  <NavigationMenuLink className="rounded-full" asChild>
                    <Link
                      href="/"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white h-8 px-4 text-sm',
                      )}
                    >
                      Beranda
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      'rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white h-8 px-4 text-sm',
                    )}
                  >
                    Layanan
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-surface-card">
                    <div className="w-[min(100vw-2rem,720px)] p-2 sm:w-[720px]">
                      {serviceCategories.length === 0 ? (
                        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                          Belum ada layanan.{' '}
                          <Link
                            href="/layanan"
                            className="font-semibold underline-offset-4 hover:underline"
                            style={{ color: BRAND }}
                          >
                            Lihat halaman layanan
                          </Link>
                        </div>
                      ) : (
                        <div className="flex max-h-[min(70vh,400px)] min-h-[200px]er">
                          <ul
                            className="w-[50%] shrink-0 overflow-y-auto border-r border-border"
                            role="listbox"
                            aria-label="Kategori layanan"
                          >
                            {serviceCategories.map((category, catIdx) => {
                              const IconComponent =
                                CATEGORY_ICONS[catIdx % CATEGORY_ICONS.length];
                              const isActive = activeCategoryId === category.id;
                              return (
                                <li key={category.id}>
                                  <button
                                    type="button"
                                    role="option"
                                    aria-selected={isActive}
                                    className={cn(
                                      'flex w-full items-start gap-2 px-2.5 py-2.5 text-left text-sm transition-colors',
                                      isActive
                                        ? 'bg-surface-subtle font-medium text-foreground'
                                        : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground',
                                    )}
                                    onMouseEnter={() =>
                                      setActiveCategoryId(category.id)
                                    }
                                    onFocus={() =>
                                      setActiveCategoryId(category.id)
                                    }
                                  >
                                    <IconComponent
                                      className="mt-0.5 h-4 w-4 shrink-0"
                                      style={{ color: BRAND }}
                                    />
                                    <span className="min-w-0 flex-1 leading-snug">
                                      {category.name}
                                    </span>
                                    <ChevronRight
                                      className={cn(
                                        'mt-0.5 h-4 w-4 shrink-0 opacity-40',
                                        isActive && 'opacity-70',
                                      )}
                                    />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                          <div className="min-w-0 flex-1 overflow-y-auto p-2">
                            {activeCategory ? (
                              <>
                                <p className="mt-1 mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                  {activeCategory.name}
                                </p>
                                <ul className="space-y-0.5">
                                  {activeCategory.services.map((service) => (
                                    <li key={service.id}>
                                      <NavigationMenuLink asChild>
                                        <Link
                                          href={`/layanan/${service.slug}`}
                                          className="flex min-w-0 w-full flex-col gap-0.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-surface-subtle"
                                        >
                                          <span className="flex min-w-0 flex-wrap items-center gap-1.5 font-medium leading-snug text-foreground">
                                            {service.name}
                                            <div className="flex shrink-0 items-center gap-1">
                                              {service.is_popular && (
                                                <span
                                                  className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white"
                                                  style={{
                                                    backgroundColor: BRAND,
                                                  }}
                                                >
                                                  Populer
                                                </span>
                                              )}
                                              {service.is_featured && (
                                                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                                                  Unggulan
                                                </span>
                                              )}
                                            </div>
                                          </span>
                                          {service.short_description ? (
                                            <p className="mt-0.5 min-h-0 min-w-0 text-xs leading-snug text-muted-foreground wrap-anywhere line-clamp-2">
                                              {service.short_description}
                                            </p>
                                          ) : null}
                                        </Link>
                                      </NavigationMenuLink>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : null}
                          </div>
                        </div>
                      )}
                      <div className="mt-2 border-t border-border pt-2">
                        <Link
                          href="/layanan"
                          className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: BRAND }}
                        >
                          Lihat Semua Layanan
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="rounded-full" asChild>
                    <Link
                      href="/tentang"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white h-8 px-4 text-sm',
                      )}
                    >
                      Tentang
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="rounded-full" asChild>
                    <Link
                      href="/blog"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white h-8 px-4 text-sm',
                      )}
                    >
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="rounded-full" asChild>
                    <Link
                      href="/kontak"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white h-8 px-4 text-sm',
                      )}
                    >
                      Kontak
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons + Theme Toggle */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Link
              href="/masuk"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-full hover:opacity-90 transition-opacity shadow-sm"
              style={{ backgroundColor: BRAND }}
            >
              Mulai Sekarang
            </Link>
          </div>

          {/* Mobile right: toggle + hamburger */}
          <div className="lg:hidden flex items-center gap-1 md:gap-2">
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Link
                href="/masuk"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="px-5 py-2.5 text-sm font-semibold text-white rounded-full hover:opacity-90 transition-opacity shadow-sm"
                style={{ backgroundColor: BRAND }}
              >
                Mulai Sekarang
              </Link>
            </div>
            <button
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-[oklch(0.13_0.02_260)]/95 backdrop-blur-md border-t border-gray-100 dark:border-white/8 px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
          <Link
            href="/"
            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Beranda
          </Link>

          <div>
            <button
              className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium"
              onClick={() =>
                setMobileOpen(mobileOpen === 'layanan' ? null : 'layanan')
              }
            >
              Layanan
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform',
                  mobileOpen === 'layanan' && 'rotate-180',
                )}
              />
            </button>
            {mobileOpen === 'layanan' && (
              <div className="mt-1 ml-2 max-h-[55vh] space-y-3 overflow-y-auto border-l-2 border-gray-100 pl-3 dark:border-white/10">
                {serviceCategories.length === 0 ? (
                  <Link
                    href="/layanan"
                    className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/8"
                    onClick={() => setIsOpen(false)}
                  >
                    Lihat layanan
                  </Link>
                ) : (
                  serviceCategories.map((category) => (
                    <div key={category.id} className="space-y-1">
                      <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">
                        {category.name}
                      </p>
                      {category.services.map((service) => (
                        <Link
                          key={service.id}
                          href={`/layanan/${service.slug}`}
                          className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/8"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="flex flex-wrap items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
                            {service.name}
                            {service.is_popular && (
                              <span
                                className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white"
                                style={{ backgroundColor: BRAND }}
                              >
                                Populer
                              </span>
                            )}
                          </span>
                          {service.short_description ? (
                            <span className="mt-0.5 block min-h-0 min-w-0 text-xs text-gray-500 wrap-anywhere line-clamp-2 dark:text-gray-500">
                              {service.short_description}
                            </span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            href="/tentang"
            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Tentang
          </Link>
          <Link
            href="/blog"
            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/kontak"
            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Kontak
          </Link>

          <div className="pt-3 border-t border-gray-100 dark:border-white/8 flex flex-col gap-2 md:hidden">
            <Link
              href="/masuk"
              className="px-4 py-2.5 text-sm text-center text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="px-4 py-2.5 text-sm font-semibold text-white rounded-full text-center hover:opacity-90 transition-opacity"
              style={{ backgroundColor: BRAND }}
              onClick={() => setIsOpen(false)}
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
