import { useI18n } from '../../i18n/I18nContext'
import { Icon } from '../icons/Icon'

export function Footer() {
  const { t, lang, toggleLang } = useI18n()

  const columns: { title: string; links: readonly string[] }[] = [
    { title: t.footer.products, links: t.footer.productLinks },
    { title: t.footer.community, links: t.footer.communityLinks },
    { title: t.footer.company, links: t.footer.companyLinks },
    { title: t.footer.legal, links: t.footer.legalLinks },
  ]

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="brand">
            <span className="brand-mark">D</span>
            <span>
              dot<span>market</span>
            </span>
          </div>
          <p>{t.footer.tagline}</p>
          <div className="socials">
            <a href="#" aria-label="X">
              <Icon name="x" size={16} />
            </a>
            <a href="#" aria-label="Telegram">
              <Icon name="telegram" size={16} />
            </a>
            <a href="#" aria-label="Community">
              <Icon name="bell" size={16} />
            </a>
          </div>
          <button className="lang-pill" onClick={toggleLang}>
            <Icon name="globe" size={14} /> {t.footer.language}: {lang === 'en' ? 'English' : 'فارسی'}
          </button>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3>{col.title}</h3>
            {col.links.map((link) => (
              <a key={link} href="#">
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-disclaimer">{t.footer.disclaimer}</div>
      <div className="footer-bottom">
        <span>{t.footer.copyright}</span>
        <span>{t.footer.download}: iOS · Android</span>
      </div>
    </footer>
  )
}
