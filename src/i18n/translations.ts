export type Language = 'en' | 'fa'

export interface Dictionary {
  announcement: string
  viewAll: string
  nav: {
    cryptocurrencies: string
    exchanges: string
    community: string
    products: string
    learn: string
    watchlist: string
    portfolio: string
    login: string
    signup: string
    search: string
    searchPlaceholder: string
  }
  navMenus: {
    cryptocurrencies: string[]
    exchanges: string[]
    community: string[]
    products: string[]
    learn: string[]
  }
  statsBar: {
    cryptos: string
    exchanges: string
    marketCap: string
    volume24h: string
    dominance: string
    gas: string
  }
  hero: {
    eyebrow: string
    titleLine1: string
    titleLine2Em: string
    copy: string
    marketCapLabel: string
    changeLabel: string
    volumeLabel: string
    chartTitle: string
    chartSubtitle: string
  }
  trending: {
    title: string
    subtitle: string
    tabs: { trending: string; gainers: string; losers: string; recentlyAdded: string }
  }
  filters: {
    all: string
    top: string
    trending: string
    gainersLosers: string
    recentlyAdded: string
    mostVisited: string
    categories: string
    defi: string
    nft: string
    layer1: string
  }
  table: {
    sectionEyebrow: string
    sectionTitle: string
    rank: string
    name: string
    price: string
    change1h: string
    change24h: string
    change7d: string
    marketCap: string
    volume24h: string
    circulatingSupply: string
    last7d: string
    showingRows: string
    page: string
    noResults: string
  }
  pagination: { prev: string; next: string }
  detail: {
    back: string
    priceOf: (name: string) => string
    statsTitle: (name: string) => string
    high: string
    low: string
    supply: string
    max: string
    fdv: string
    rank: string
    overview: string
    markets: string
    about: string
    aboutBody: (name: string) => string
    converter: string
    watchlistAdd: string
    buy: string
    verified: string
  }
  footer: {
    tagline: string
    products: string
    productLinks: string[]
    community: string
    communityLinks: string[]
    company: string
    companyLinks: string[]
    legal: string
    legalLinks: string[]
    language: string
    currency: string
    download: string
    copyright: string
    disclaimer: string
  }
  theme: { light: string; dark: string }
  placeholder: {
    comingSoon: string
    body: string
    back: string
  }
}

export const dictionaries: Record<Language, Dictionary> = {
  en: {
    announcement: 'Crypto market is up 2.8% today',
    viewAll: 'View more',
    nav: {
      cryptocurrencies: 'Cryptocurrencies',
      exchanges: 'Exchanges',
      community: 'Community',
      products: 'Products',
      learn: 'Learn',
      watchlist: 'Watchlist',
      portfolio: 'Portfolio',
      login: 'Log in',
      signup: 'Sign up',
      search: 'Search',
      searchPlaceholder: 'Search coins, exchanges...',
    },
    navMenus: {
      cryptocurrencies: ['All cryptocurrencies', 'Trending coins', 'Gainers & losers', 'New listings', 'Categories'],
      exchanges: ['All exchanges', 'Spot markets', 'Derivatives', 'DEX markets'],
      community: ['Community feed', 'Learn crypto', 'Glossary', 'Forums'],
      products: ['Currency converter', 'Gas tracker', 'API', 'Portfolio tracker'],
      learn: ['Beginner guides', 'Articles', 'Videos', 'Research reports'],
    },
    statsBar: {
      cryptos: 'Cryptos',
      exchanges: 'Exchanges',
      marketCap: 'Market Cap',
      volume24h: '24h Vol',
      dominance: 'Dominance',
      gas: 'Gas',
    },
    hero: {
      eyebrow: 'Live market pulse',
      titleLine1: 'Today’s Global Crypto',
      titleLine2Em: 'Market Cap',
      copy: 'Track prices, trends, and opportunities across the market in one intelligent workspace.',
      marketCapLabel: 'Market cap',
      changeLabel: '24h change',
      volumeLabel: '24h volume',
      chartTitle: 'Market cap',
      chartSubtitle: 'Last 30 days',
    },
    trending: {
      title: 'Today’s Cryptocurrency Prices by Market Cap',
      subtitle: 'The global cryptocurrency market cap today is driven by thousands of coins and tokens.',
      tabs: { trending: 'Trending', gainers: 'Gainers', losers: 'Losers', recentlyAdded: 'Recently added' },
    },
    filters: {
      all: 'All',
      top: 'Top',
      trending: 'Trending',
      gainersLosers: 'Gainers & Losers',
      recentlyAdded: 'Recently Added',
      mostVisited: 'Most Visited',
      categories: 'Categories',
      defi: 'DeFi',
      nft: 'NFT',
      layer1: 'Layer 1',
    },
    table: {
      sectionEyebrow: 'Cryptocurrencies',
      sectionTitle: 'All Cryptocurrencies',
      rank: '#',
      name: 'Name',
      price: 'Price',
      change1h: '1h %',
      change24h: '24h %',
      change7d: '7d %',
      marketCap: 'Market Cap',
      volume24h: 'Volume(24h)',
      circulatingSupply: 'Circulating Supply',
      last7d: 'Last 7 Days',
      showingRows: 'Show rows',
      page: 'Page',
      noResults: 'No cryptocurrencies match your search.',
    },
    pagination: { prev: 'Previous', next: 'Next' },
    detail: {
      back: 'Back to market',
      priceOf: (name: string) => `${name} price`,
      statsTitle: (name: string) => `${name} stats`,
      high: 'All-time high',
      low: 'All-time low',
      supply: 'Circulating supply',
      max: 'Max supply',
      fdv: 'Fully diluted valuation',
      rank: 'Rank',
      overview: 'Overview',
      markets: 'Markets',
      about: 'About',
      aboutBody: (name: string) =>
        `${name} is a decentralized digital asset that enables fast, secure and transparent transactions. Explore live price data, market statistics and historical performance on dotmarket.`,
      converter: 'Converter',
      watchlistAdd: 'Add to watchlist',
      buy: 'Buy',
      verified: 'Verified asset',
    },
    footer: {
      tagline: 'The easiest way to track the crypto market, built for the next generation of traders.',
      products: 'Products',
      productLinks: ['Cryptocurrencies', 'Exchanges', 'NFT', 'DeFi', 'Portfolio tracker', 'Currency converter', 'API'],
      community: 'Community',
      communityLinks: ['Alexandria (Learn)', 'Glossary', 'Research', 'Forums', 'Events'],
      company: 'Company',
      companyLinks: ['About us', 'Careers', 'Blog', 'Press kit'],
      legal: 'Legal & privacy',
      legalLinks: ['Terms of use', 'Privacy policy', 'Cookie policy', 'Disclaimer'],
      language: 'Language',
      currency: 'Currency',
      download: 'Get the app',
      copyright: '© 2026 dotmarket. All rights reserved.',
      disclaimer:
        'Cryptocurrencies are volatile and speculative assets. Prices shown are for informational purposes only and are not financial advice.',
    },
    theme: { light: 'Light', dark: 'Dark' },
    placeholder: {
      comingSoon: 'Coming soon',
      body: "This page is on its way. We're still building it out.",
      back: 'Back to home',
    },
  },
  fa: {
    announcement: 'بازار کریپتو امروز ۲.۸٪ رشد کرده است',
    viewAll: 'مشاهده بیشتر',
    nav: {
      cryptocurrencies: 'رمزارزها',
      exchanges: 'صرافی‌ها',
      community: 'جامعه',
      products: 'محصولات',
      learn: 'آموزش',
      watchlist: 'لیست پیگیری',
      portfolio: 'پرتفوی',
      login: 'ورود',
      signup: 'ثبت‌نام',
      search: 'جستجو',
      searchPlaceholder: 'جستجوی رمزارز، صرافی...',
    },
    navMenus: {
      cryptocurrencies: ['همه رمزارزها', 'روندهای داغ', 'سود و زیان‌ده‌ها', 'تازه‌واردها', 'دسته‌بندی‌ها'],
      exchanges: ['همه صرافی‌ها', 'بازار اسپات', 'مشتقات', 'صرافی‌های غیرمتمرکز'],
      community: ['اخبار جامعه', 'آموزش رمزارز', 'واژه‌نامه', 'انجمن‌ها'],
      products: ['مبدل ارز', 'گس‌ترکر', 'API', 'ردیاب پرتفوی'],
      learn: ['راهنمای مبتدیان', 'مقالات', 'ویدیوها', 'گزارش‌های پژوهشی'],
    },
    statsBar: {
      cryptos: 'رمزارزها',
      exchanges: 'صرافی‌ها',
      marketCap: 'ارزش بازار',
      volume24h: 'حجم ۲۴ساعته',
      dominance: 'سهم بازار',
      gas: 'کارمزد گس',
    },
    hero: {
      eyebrow: 'نبض زنده بازار',
      titleLine1: 'ارزش بازار جهانی',
      titleLine2Em: 'رمزارزها امروز',
      copy: 'قیمت‌ها، روندها و فرصت‌های بازار را در یک فضای هوشمند دنبال کنید.',
      marketCapLabel: 'ارزش بازار',
      changeLabel: 'تغییر ۲۴ساعته',
      volumeLabel: 'حجم ۲۴ساعته',
      chartTitle: 'ارزش بازار',
      chartSubtitle: '۳۰ روز گذشته',
    },
    trending: {
      title: 'قیمت رمزارزها بر اساس ارزش بازار',
      subtitle: 'ارزش بازار جهانی رمزارز امروز توسط هزاران کوین و توکن شکل گرفته است.',
      tabs: { trending: 'داغ', gainers: 'سودده', losers: 'زیان‌ده', recentlyAdded: 'تازه اضافه‌شده' },
    },
    filters: {
      all: 'همه',
      top: 'برتر',
      trending: 'داغ',
      gainersLosers: 'سود و زیان',
      recentlyAdded: 'تازه اضافه‌شده',
      mostVisited: 'پربازدیدترین',
      categories: 'دسته‌بندی‌ها',
      defi: 'دیفای',
      nft: 'NFT',
      layer1: 'لایه ۱',
    },
    table: {
      sectionEyebrow: 'رمزارزها',
      sectionTitle: 'همه رمزارزها',
      rank: '#',
      name: 'نام',
      price: 'قیمت',
      change1h: '۱ساعت٪',
      change24h: '۲۴ساعت٪',
      change7d: '۷روز٪',
      marketCap: 'ارزش بازار',
      volume24h: 'حجم(۲۴ساعت)',
      circulatingSupply: 'عرضه در گردش',
      last7d: '۷ روز گذشته',
      showingRows: 'تعداد ردیف',
      page: 'صفحه',
      noResults: 'رمزارزی مطابق با جستجوی شما یافت نشد.',
    },
    pagination: { prev: 'قبلی', next: 'بعدی' },
    detail: {
      back: 'بازگشت به بازار',
      priceOf: (name: string) => `قیمت ${name}`,
      statsTitle: (name: string) => `آمار ${name}`,
      high: 'بالاترین قیمت تاریخ',
      low: 'پایین‌ترین قیمت تاریخ',
      supply: 'عرضه در گردش',
      max: 'حداکثر عرضه',
      fdv: 'ارزش کاملاً رقیق‌شده',
      rank: 'رتبه',
      overview: 'نمای کلی',
      markets: 'بازارها',
      about: 'درباره',
      aboutBody: (name: string) =>
        `${name} یک دارایی دیجیتال غیرمتمرکز است که امکان تراکنش‌های سریع، امن و شفاف را فراهم می‌کند. داده‌های لحظه‌ای قیمت، آمار بازار و عملکرد تاریخی را در dotmarket دنبال کنید.`,
      converter: 'مبدل',
      watchlistAdd: 'افزودن به لیست پیگیری',
      buy: 'خرید',
      verified: 'دارایی تأییدشده',
    },
    footer: {
      tagline: 'ساده‌ترین راه برای دنبال کردن بازار رمزارز، ساخته شده برای نسل بعدی معامله‌گران.',
      products: 'محصولات',
      productLinks: ['رمزارزها', 'صرافی‌ها', 'NFT', 'دیفای', 'ردیاب پرتفوی', 'مبدل ارز', 'API'],
      community: 'جامعه',
      communityLinks: ['آموزش', 'واژه‌نامه', 'پژوهش', 'انجمن‌ها', 'رویدادها'],
      company: 'شرکت',
      companyLinks: ['درباره ما', 'فرصت‌های شغلی', 'وبلاگ', 'بسته مطبوعاتی'],
      legal: 'قوانین و حریم خصوصی',
      legalLinks: ['شرایط استفاده', 'حریم خصوصی', 'سیاست کوکی', 'سلب مسئولیت'],
      language: 'زبان',
      currency: 'واحد پول',
      download: 'دریافت اپلیکیشن',
      copyright: '© ۲۰۲۶ dotmarket. تمامی حقوق محفوظ است.',
      disclaimer:
        'رمزارزها دارایی‌هایی نوسانی و پرریسک هستند. قیمت‌های نمایش داده شده صرفاً جنبه اطلاع‌رسانی دارند و توصیه مالی محسوب نمی‌شوند.',
    },
    theme: { light: 'روشن', dark: 'تیره' },
    placeholder: {
      comingSoon: 'به‌زودی',
      body: 'این صفحه در حال ساخت است، به‌زودی تکمیل می‌شود.',
      back: 'بازگشت به صفحه اصلی',
    },
  },
}
