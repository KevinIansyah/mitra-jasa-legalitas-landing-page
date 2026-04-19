/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Building2, FileText, Shield, Award, Gavel, HelpCircle, ChevronDown, ChevronRight, Sun, Moon, Loader2, Bell } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/lib/types/user";
import { BRAND_BLUE } from "@/lib/types/constants";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import navLogo from "@/public/nav-logo.svg";
import Image from "next/image";
import { NavigationData } from "@/lib/types/navigation";
import { fetchUnreadCount } from "@/lib/api/endpoints/notifications";

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function NavbarUserAvatar({ user, size = "default" }: { user: User; size?: "default" | "large" }) {
  return (
    <Avatar className={cn(size === "large" ? "h-10 w-10  border-none shadow-none" : "h-9 w-9  border-none shadow-none")}>
      {user.avatar ? <AvatarImage src={user.avatar} alt="Foto profil" className="object-cover object-center" /> : null}
      <AvatarFallback className={cn("font-semibold text-white", size === "large" ? "text-sm" : "text-xs")} style={{ backgroundColor: BRAND_BLUE }}>
        {userInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}

const CATEGORY_ICONS = [Building2, FileText, Shield, Award, Gavel, HelpCircle] as const;

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
    >
      {isDark ? <Sun className="size-4.5" aria-hidden /> : <Moon className="size-4.5" aria-hidden />}
    </button>
  );
}

interface NavbarProps {
  navigation: NavigationData;
  initialUser?: User | null;
}

export function Navbar({ navigation, initialUser = null }: NavbarProps) {
  const { user, logout, isAuthenticated, isLoading, isError } = useAuth({
    initialUser: initialUser ?? undefined,
  });
  const showAccount = Boolean(isAuthenticated && user && !isError);

  const [notifUnread, setNotifUnread] = useState<number | null>(null);

  useEffect(() => {
    if (!showAccount || !user) {
      setNotifUnread(null);
      return;
    }
    let cancelled = false;
    fetchUnreadCount()
      .then((count) => {
        if (!cancelled) setNotifUnread(count);
      })
      .catch(() => {
        if (!cancelled) setNotifUnread(null);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAccount, user?.id]);

  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const serviceCategories = React.useMemo(() => navigation.service_categories ?? [], [navigation.service_categories]);

  React.useEffect(() => {
    setActiveCategoryId((prev) => {
      if (prev != null && serviceCategories.some((c) => c.id === prev)) {
        return prev;
      }
      return serviceCategories[0]?.id ?? null;
    });
  }, [serviceCategories]);

  const activeCategory = serviceCategories.find((c) => c.id === activeCategoryId) ?? serviceCategories[0];

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Image src={navLogo} alt="Logo Mitra Jasa Legalitas" height={40} loading="eager" />
          </Link>

          {/* ────────────────── Desktop Navigation ────────────────── */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="bg-gray-100/70 dark:bg-white/8 rounded-full px-2 py-1.5 gap-0.5">
                <NavigationMenuItem>
                  <NavigationMenuLink className="rounded-full" asChild>
                    <Link
                      href="/"
                      className={cn(navigationMenuTriggerStyle(), "rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white h-8 px-4 text-sm")}
                    >
                      Beranda
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn("rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white h-8 px-4 text-sm")}>
                    Layanan
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-surface-card">
                    <div className="w-[min(100vw-2rem,720px)] p-2 sm:w-[720px]">
                      {serviceCategories.length === 0 ? (
                        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                          Belum ada layanan.{" "}
                          <Link href="/layanan" className="font-semibold underline-offset-4 hover:underline" style={{ color: BRAND_BLUE }}>
                            Lihat halaman layanan
                          </Link>
                        </div>
                      ) : (
                        <div className="flex max-h-[min(70vh,400px)] min-h-[200px]er">
                          <ul className="w-[50%] shrink-0 overflow-y-auto border-r border-border" role="listbox" aria-label="Kategori layanan">
                            {serviceCategories.map((category, catIdx) => {
                              const IconComponent = CATEGORY_ICONS[catIdx % CATEGORY_ICONS.length];
                              const isActive = activeCategoryId === category.id;
                              return (
                                <li key={category.id}>
                                  <button
                                    type="button"
                                    role="option"
                                    aria-selected={isActive}
                                    className={cn(
                                      "flex w-full items-start gap-2 px-2.5 py-2.5 text-left text-sm transition-colors",
                                      isActive ? "bg-surface-subtle font-medium text-foreground" : "text-muted-foreground hover:bg-surface-subtle hover:text-foreground",
                                    )}
                                    onMouseEnter={() => setActiveCategoryId(category.id)}
                                    onFocus={() => setActiveCategoryId(category.id)}
                                  >
                                    <IconComponent className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BRAND_BLUE }} />
                                    <span className="min-w-0 flex-1 leading-snug">{category.name}</span>
                                    <ChevronRight className={cn("mt-0.5 h-4 w-4 shrink-0 opacity-40", isActive && "opacity-70")} />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                          <div className="min-w-0 flex-1 overflow-y-auto p-2">
                            {activeCategory ? (
                              <>
                                <p className="mt-1 mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{activeCategory.name}</p>
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
                                                <div
                                                  className="inline-flex items-center gap px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                                                  style={{
                                                    backgroundColor: "oklch(0.7319 0.1856 52.89)",
                                                  }}
                                                >
                                                  Populer
                                                </div>
                                              )}
                                              {service.is_featured && (
                                                <div className="inline-flex items-center gap px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                                  Unggulan
                                                </div>
                                              )}
                                            </div>
                                          </span>
                                          {service.short_description ? (
                                            <p className="mt-0.5 min-h-0 min-w-0 text-xs leading-snug text-muted-foreground wrap-anywhere line-clamp-2">{service.short_description}</p>
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
                          style={{ backgroundColor: BRAND_BLUE }}
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
                      className={cn(navigationMenuTriggerStyle(), "rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white h-8 px-4 text-sm")}
                    >
                      Tentang
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="rounded-full" asChild>
                    <Link
                      href="/blog"
                      className={cn(navigationMenuTriggerStyle(), "rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white h-8 px-4 text-sm")}
                    >
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink className="rounded-full" asChild>
                    <Link
                      href="/kontak"
                      className={cn(navigationMenuTriggerStyle(), "rounded-full bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white h-8 px-4 text-sm")}
                    >
                      Kontak
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* ────────────────── Auth Buttons + Theme Toggle ────────────────── */}
          <div className="hidden lg:flex items-center shrink-0">
            <ThemeToggle />

            {showAccount && user ? (
              <Link
                href="/portal/notifikasi"
                className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 mr-3"
                aria-label={notifUnread != null && notifUnread > 0 ? `Notifikasi, ${notifUnread} belum dibaca` : "Notifikasi"}
              >
                <Bell className="size-4.5" aria-hidden />
                {notifUnread != null && notifUnread > 0 ? (
                  <div className="absolute -right-px -top-px flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-white">
                    <span className="mb-0.5">{notifUnread > 99 ? "99+" : notifUnread}</span>
                  </div>
                ) : null}
              </Link>
            ) : null}

            {isLoading ? (
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" aria-hidden />
            ) : showAccount && user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    className="shrink-0 rounded-full outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-blue"
                    aria-label="Menu akun"
                  >
                    <NavbarUserAvatar user={user} />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    sideOffset={8}
                    align="end"
                    className="z-100 min-w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-gray-900 shadow-lg dark:border-white/10 dark:bg-[oklch(0.13_0.02_260)] dark:text-gray-100"
                  >
                    <div className="border-b border-gray-100 px-3 py-2.5 dark:border-white/10">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <DropdownMenu.Item asChild>
                      <Link href="/portal" className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 dark:data-highlighted:bg-white/10">
                        Portal
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link href="/portal/notifikasi" className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 dark:data-highlighted:bg-white/10">
                        Notifikasi
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link href="/pengaturan/profil" className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 dark:data-highlighted:bg-white/10">
                        Pengaturan profil
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-white/10" />
                    <DropdownMenu.Item
                      className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-destructive outline-none data-highlighted:bg-destructive/10 dark:data-highlighted:bg-destructive/15"
                      onSelect={(e) => {
                        e.preventDefault();
                        void logout();
                      }}
                    >
                      Keluar
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/masuk" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3">
                  Masuk
                </Link>
                <Link href="/daftar" className="px-5 py-2.5 text-sm font-semibold text-white rounded-full hover:opacity-90 transition-opacity shadow-sm" style={{ backgroundColor: BRAND_BLUE }}>
                  Mulai Sekarang
                </Link>
              </div>
            )}
          </div>

          {/* ───────────────── mobile Right Humberger ───────────────── */}
          <div className="lg:hidden flex items-center">
            <ThemeToggle />
            {showAccount && user ? (
              <Link
                href="/portal/notifikasi"
                className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 lg:hidden mr-1"
                aria-label={notifUnread != null && notifUnread > 0 ? `Notifikasi, ${notifUnread} belum dibaca` : "Notifikasi"}
              >
                <Bell className="size-4.5" aria-hidden />
                {notifUnread != null && notifUnread > 0 ? (
                  <div className="absolute -right-px -top-px flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-white ">
                    <span className="mb-0.5">{notifUnread > 99 ? "99+" : notifUnread}</span>
                  </div>
                ) : null}
              </Link>
            ) : null}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {isLoading ? (
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" aria-hidden />
              ) : showAccount && user ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      type="button"
                      className="shrink-0 rounded-full outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-blue"
                      aria-label="Menu akun"
                    >
                      <NavbarUserAvatar user={user} />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      sideOffset={8}
                      align="end"
                      className="z-100 min-w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-gray-900 shadow-lg dark:border-white/10 dark:bg-[oklch(0.13_0.02_260)] dark:text-gray-100"
                    >
                      <div className="border-b border-gray-100 px-3 py-2.5 dark:border-white/10">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      <DropdownMenu.Item asChild>
                        <Link href="/portal" className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 dark:data-highlighted:bg-white/10">
                          Portal
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/portal/notifikasi"
                          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 dark:data-highlighted:bg-white/10"
                        >
                          Notifikasi
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/pengaturan/profil"
                          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 dark:data-highlighted:bg-white/10"
                        >
                          Pengaturan profil
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-white/10" />
                      <DropdownMenu.Item
                        className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-destructive outline-none data-highlighted:bg-destructive/10 dark:data-highlighted:bg-destructive/15"
                        onSelect={(e) => {
                          e.preventDefault();
                          void logout();
                        }}
                      >
                        Keluar
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ) : (
                <>
                  <Link href="/masuk" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3">
                    Masuk
                  </Link>
                  <Link href="/daftar" className="px-5 py-2.5 text-sm font-semibold text-white rounded-full hover:opacity-90 transition-opacity shadow-sm" style={{ backgroundColor: BRAND_BLUE }}>
                    Mulai Sekarang
                  </Link>
                </>
              )}
            </div>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              {isOpen ? <X className="w-5 h-5" aria-hidden /> : <Menu className="w-5 h-5" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────── Mobile Navigation ───────────────── */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-[oklch(0.13_0.02_260)]/95 backdrop-blur-md border-t border-gray-100 dark:border-white/8 px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
          <Link href="/" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium" onClick={() => setIsOpen(false)}>
            Beranda
          </Link>

          <div>
            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium"
              onClick={() => setMobileOpen(mobileOpen === "layanan" ? null : "layanan")}
              aria-expanded={mobileOpen === "layanan"}
            >
              Layanan
              <ChevronDown className={cn("w-4 h-4 transition-transform", mobileOpen === "layanan" && "rotate-180")} aria-hidden />
            </button>
            {mobileOpen === "layanan" && (
              <div className="mt-1 ml-2 max-h-[55vh] space-y-3 overflow-y-auto border-l-2 border-gray-100 pl-3 dark:border-white/10">
                {serviceCategories.length === 0 ? (
                  <Link href="/layanan" className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/8" onClick={() => setIsOpen(false)}>
                    Lihat layanan
                  </Link>
                ) : (
                  serviceCategories.map((category) => (
                    <div key={category.id} className="space-y-1">
                      <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">{category.name}</p>
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
                              <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white" style={{ backgroundColor: BRAND_BLUE }}>
                                Populer
                              </span>
                            )}
                          </span>
                          {service.short_description ? (
                            <span className="mt-0.5 block min-h-0 min-w-0 text-xs text-gray-500 wrap-anywhere line-clamp-2 dark:text-gray-500">{service.short_description}</span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <Link href="/tentang" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium" onClick={() => setIsOpen(false)}>
            Tentang
          </Link>
          <Link href="/blog" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium" onClick={() => setIsOpen(false)}>
            Blog
          </Link>
          <Link href="/kontak" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium" onClick={() => setIsOpen(false)}>
            Kontak
          </Link>

          <div className="pt-3 border-t border-gray-100 dark:border-white/8 flex flex-col gap-2 md:hidden">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Memuat akun...
              </div>
            ) : showAccount && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <NavbarUserAvatar user={user} size="large" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/portal"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Portal
                </Link>
                <Link
                  href="/portal/notifikasi"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Notifikasi
                </Link>
                <Link
                  href="/pengaturan/profil"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/8 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Pengaturan profil
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-destructive rounded-xl hover:bg-destructive/10 dark:hover:bg-destructive/15"
                  onClick={() => {
                    setIsOpen(false);
                    void logout();
                  }}
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
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
                  style={{ backgroundColor: BRAND_BLUE }}
                  onClick={() => setIsOpen(false)}
                >
                  Mulai Sekarang
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
