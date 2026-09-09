import { Link, useParams } from "react-router-dom";

import { Icon } from "@/components/icons/Icon";
import { deslugify } from "@/lib/slug";
import { useI18n } from "@/i18n/I18nContext";

export function PlaceholderPage({ title }: { title?: string }) {
  const { slug } = useParams();
  const { t } = useI18n();
  const heading = title ?? (slug ? deslugify(slug) : t.placeholder.comingSoon);

  return (
    <main className="mx-auto flex max-w-[1240px] flex-col items-center gap-4 px-6 py-32 text-center">
      <span className="rounded-full bg-gold-soft px-3 py-1 text-[12px] font-bold uppercase tracking-[.14em] text-gold">
        {t.placeholder.comingSoon}
      </span>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        {heading}
      </h1>
      <p className="max-w-md text-sm text-muted">{t.placeholder.body}</p>
      <Link
        to="/"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
      >
        <Icon name="arrow" size={14} className="rotate-180" />
        {t.placeholder.back}
      </Link>
    </main>
  );
}
