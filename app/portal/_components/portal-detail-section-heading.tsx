type Props = {
  title: string;
  description: string;
};

/** Judul + deskripsi singkat per blok (selaras detail proyek). */
export function PortalDetailSectionHeading({ title, description }: Props) {
  return (
    <header className="space-y-1.5">
      <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h3>
      <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}
