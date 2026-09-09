import { Icon } from "../icons/Icon";
import { Link } from "react-router-dom";
import { slugify } from "../../lib/slug";
import { useI18n } from "../../i18n/I18nContext";

export function Footer() {
  const { t, lang, toggleLang } = useI18n();

  const columns: { title: string; links: readonly string[] }[] = [
    { title: t.footer.products, links: t.footer.productLinks },
    { title: t.footer.community, links: t.footer.communityLinks },
    { title: t.footer.company, links: t.footer.companyLinks },
    { title: t.footer.legal, links: t.footer.legalLinks },
  ];

  return (
    <footer className="border-t border-line bg-surface-2 px-6 pb-6 pt-14 nav:px-[max(30px,calc((100%-1180px)/2))]">
      <div className="grid grid-cols-2 gap-7 pb-10 nav:grid-cols-[2.1fr_repeat(4,1fr)] nav:gap-9">
        <div className="col-span-2 nav:col-span-1">
          <div className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-ink">
            <span className="grid h-6.75 w-6.75 shrink-0 place-items-center rounded-tl-lg rounded-br-lg rounded-tr-lg bg-gold text-[17px] text-white">
              D
            </span>
            <span>
              dot<span className="text-gold">market</span>
            </span>
          </div>
          <p className="my-4 max-w-55 text-md leading-7 text-muted">
            {t.footer.tagline}
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="X"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-accent-soft text-muted hover:text-ink"
            >
              <Icon name="x" size={16} />
            </a>
            <a
              href="#"
              aria-label="Telegram"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-accent-soft text-muted hover:text-ink"
            >
              <Icon name="telegram" size={16} />
            </a>
            <a
              href="#"
              aria-label="Community"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-accent-soft text-muted hover:text-ink"
            >
              <Icon name="bell" size={16} />
            </a>
          </div>
          <button
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-[13px] text-ink"
            onClick={toggleLang}
          >
            <Icon name="globe" size={14} /> {t.footer.language}:{" "}
            {lang === "en" ? "English" : "فارسی"}
          </button>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 mt-1 font-display text-md font-semibold">
              {col.title}
            </h3>
            {col.links.map((link) => (
              <Link
                key={link}
                to={`/page/${slugify(link)}`}
                className="my-2.5 block text-[13px] text-muted hover:text-ink"
              >
                {link}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-225 border-t border-line pt-4 text-[10.5px] leading-7 text-muted">
        {t.footer.disclaimer}
      </div>
      <div className="flex flex-col justify-between gap-2 pt-3.5 text-[12px] text-muted nav:flex-row">
        <span>{t.footer.copyright}</span>
        <span>{t.footer.download}: iOS · Android</span>
      </div>
    </footer>
  );
}
