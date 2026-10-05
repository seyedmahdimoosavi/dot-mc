import { Icon } from "../icons/Icon";
import { useI18n } from "../../i18n/I18nContext";

type FooterLink = {
  label: string;
  href: string;
};

function getFooterColumns(
  lang: "en" | "fa",
): { title: string; links: FooterLink[] }[] {
  const fa = lang === "fa";
  return [
    {
      title: fa ? "شرکت" : "Company",
      links: [
        {
          label: fa ? "وب‌سایت رسمی" : "Official Website",
          href: "https://dotone.online",
        },
        {
          label: fa ? "تماس با ما" : "Contact Us",
          href: "https://docs.dotone.online/resources/contact-us",
        },
        {
          label: fa ? "قوانین و حریم خصوصی" : "Terms & Privacy",
          href: "https://docs.dotone.online/terms-and-policy",
        },
      ],
    },
    {
      title: fa ? "محصولات" : "Products",
      links: [
        { label: fa ? "سواپ" : "Swap", href: "https://swap.dotone.online" },
        {
          label: fa ? "ویزارد" : "Wizard",
          href: "https://wizard.dotone.online",
        },
      ],
    },
    {
      title: fa ? "مستندات" : "Documents",
      links: [
        {
          label: fa ? "مستندات" : "Documents",
          href: "https://docs.dotone.online",
        },
        {
          label: fa ? "اکوسیستم" : "Ecosystem",
          href: "https://docs.dotone.online/getting-started/ecosystem",
        },
        {
          label: fa ? "ولیدیتورها" : "Validators",
          href: "https://docs.dotone.online/validator/overview",
        },
        {
          label: fa ? "مستندات API" : "API Documents",
          href: "https://docs.dotone.online/developers/api-reference",
        },
        {
          label: fa ? "وایت‌پیپر" : "Whitepaper",
          href: "https://docs.dotone.online/resources/whitepaper",
        },
        {
          label: fa ? "وضعیت شبکه" : "Network Status",
          href: "https://dotscan.one/stats",
        },
        { label: "GitHub", href: "https://github.com/dotOneSmartChain" },
      ],
    },
  ];
}

export function Footer() {
  const { t, lang, toggleLang } = useI18n();
  const footerColumns = getFooterColumns(lang);

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
              href="https://x.com/dotonenetwork"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-accent-soft text-muted hover:text-ink"
            >
              <Icon name="x" size={16} />
            </a>
            <a
              href="https://m.youtube.com/@DOTO_coin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-accent-soft text-muted hover:text-ink"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42C1 8.13 1 12 1 12s0 3.87.46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96C23 15.87 23 12 23 12s0-3.87-.46-5.58Z" />
                <path d="m10 15 5-3-5-3v6Z" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://medium.com/@dotone.online"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Medium"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-accent-soft text-[13px] font-extrabold text-muted hover:text-ink"
            >
              M
            </a>
            <a
              href="https://www.instagram.com/dotone_blockchain"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-accent-soft text-muted hover:text-ink"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="0.8"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
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
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 mt-1 font-display text-md font-semibold">
              {col.title}
            </h3>
            {col.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="my-2.5 block text-[13px] text-muted hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-225 border-t border-line pt-4 text-[10.5px] leading-7 text-muted">
        {t.footer.disclaimer}
      </div>
      <div className="flex flex-col justify-between gap-2 pt-3.5 text-[12px] text-muted nav:flex-row">
        <span>{t.footer.copyright}</span>
        {/* <span>{t.footer.download}: iOS · Android</span> */}
      </div>
    </footer>
  );
}
