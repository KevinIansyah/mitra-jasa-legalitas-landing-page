type PortalSectionHeaderProps = {
  title: string;
  description: string;
};

export function PortalSectionHeader({ title, description }: PortalSectionHeaderProps) {
  return (
    <header className="mb-8">
      <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}
