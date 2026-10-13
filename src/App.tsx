import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Bell, BookOpen, Bot, CalendarDays, Check, ChevronDown, Menu, MessageCircle, Mic, Moon, Plus, Send, Sparkles, Sun, X } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6'

export const GOOGLE_PLAY_URL = '#google-play-link-to-be-added'
export const APP_STORE_URL = '#app-store-link-to-be-added'

/* ---------- i18n ---------- */
type Lang = 'fr' | 'en'
type TFn = (fr: string, en: string) => string
const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'fr', setLang: () => {} })
const useLang = () => useContext(LangCtx)
function useT(): TFn { const { lang } = useLang(); return (fr, en) => (lang === 'fr' ? fr : en) }

const SOCIALS = [
  { name: 'Instagram', href: 'https://instagram.com/', icon: FaInstagram, color: '#e1306c' },
  { name: 'Facebook', href: 'https://facebook.com/', icon: FaFacebookF, color: '#1877f2' },
  { name: 'X', href: 'https://x.com/', icon: FaXTwitter, color: '#ffffff' },
  { name: 'LinkedIn', href: 'https://linkedin.com/', icon: FaLinkedinIn, color: '#0a8fdc' },
  { name: 'TikTok', href: 'https://tiktok.com/', icon: FaTiktok, color: '#25f4ee' },
  { name: 'YouTube', href: 'https://youtube.com/', icon: FaYoutube, color: '#ff2d2d' },
  { name: 'WhatsApp', href: 'https://wa.me/', icon: FaWhatsapp, color: '#25d366' },
]
function Socials() {
  const t = useT()
  return <div className="socials">{SOCIALS.map(({ name, href, icon: Icon, color }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={t(`Xena sur ${name}`, `Xena on ${name}`)} title={name} className="social" style={{ '--brand': color } as CSSProperties}><Icon size={17} /></a>)}</div>
}

/* ---------- hooks ---------- */
function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}

function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'section' | 'article' }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.12)
  return <Tag ref={ref as never} className={`reveal ${seen ? 'is-visible' : ''} ${className}`} style={{ '--d': `${delay}ms` } as CSSProperties}>{children}</Tag>
}

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.5)
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!seen) return
    let raf = 0; const t0 = performance.now(); const dur = 1400
    const tick = (t: number) => { const p = Math.min((t - t0) / dur, 1); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <span ref={ref}>{v}{suffix}</span>
}

const spotlight = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/* ---------- atoms ---------- */
function Mark({ small = false }: { small?: boolean }) { return <span className={`mark ${small ? 'mark-small' : ''}`} aria-hidden="true"><i /><b /></span> }
function Wordmark() { const t = useT(); return <a className="brand" href="#top" aria-label={t('Xena AI, accueil', 'Xena AI, home')}><Mark small /><span>XENA</span><em>AI</em></a> }
function StoreButtons() {
  const t = useT()
  return <div className="store-buttons">
    <a href={APP_STORE_URL} className="store-badge" aria-label={t("Télécharger Xena dans l'App Store", 'Download Xena on the App Store')}>
      <svg className="badge-logo apple-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" /></svg>
      <span className="badge-text"><small>{t('Télécharger dans l’', 'Download on the')}</small><strong>App Store</strong></span>
    </a>
    <a href={GOOGLE_PLAY_URL} className="store-badge" aria-label={t('Disponible sur Google Play', 'Get it on Google Play')}>
      <svg className="badge-logo play-logo" viewBox="0 0 512 512" aria-hidden="true">
        <path fill="#00d7fe" d="M48,59.49v393a4.33,4.33,0,0,0,7.37,3.07L260,256,55.37,56.42A4.33,4.33,0,0,0,48,59.49Z" />
        <path fill="#00f076" d="M345.8,174,89.22,32.64l-.16-.09c-4.42-2.4-8.62,3.58-5,7.06l201.13,192.32Z" />
        <path fill="#ff3a44" d="M449.38,231l-71.65-39.46L310.36,256l67.37,64.43L449.38,281C468.87,270.23,468.87,241.77,449.38,231Z" />
        <path fill="#ffd400" d="M84.08,472.4c-3.6,3.48.6,9.46,5,7.06l.16-.09L345.8,338l-60.61-57.95Z" />
      </svg>
      <span className="badge-text"><small>{t('DISPONIBLE SUR', 'GET IT ON')}</small><strong>Google Play</strong></span>
    </a>
  </div>
}

function Navbar({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const t = useT()
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const on = () => { const h = document.documentElement; setScrolled(window.scrollY > 24); setProgress(window.scrollY / Math.max(1, h.scrollHeight - h.clientHeight)) }
    on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on)
  }, [])
  const links: [string, string][] = [['#xena', 'Xena'], ['#features', t('Fonctionnalités', 'Features')], ['#how', t('Comment ça marche', 'How it works')], ['#faq', 'FAQ']]
  const toggleLang = () => setLang(lang === 'fr' ? 'en' : 'fr')
  return <header className={`nav-wrap ${scrolled ? 'scrolled' : ''}`}>
    <div className="progress" style={{ transform: `scaleX(${progress})` }} />
    <nav className="nav">
      <Wordmark />
      <div className="nav-links">{links.map(([h, l]) => <a key={h} href={h}>{l}</a>)}</div>
      <div className="nav-actions">
        <button className="language" onClick={toggleLang} aria-label={t('Switch to English', 'Passer en français')}>{lang.toUpperCase()} <ChevronDown size={13} /></button>
        <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label={dark ? t('Activer le mode clair', 'Switch to light mode') : t('Activer le mode sombre', 'Switch to dark mode')}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
        <a className="nav-download" href="#download">{t('Télécharger', 'Download')} <ArrowRight size={15} /></a>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={t('Ouvrir le menu', 'Open menu')}>{open ? <X /> : <Menu />}</button>
      </div>
    </nav>
    {open && <div className="mobile-menu">{links.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}<a href="#download" onClick={() => setOpen(false)}>{t('Télécharger l’app', 'Download the app')}</a><button className="mobile-lang" onClick={toggleLang}>{lang === 'fr' ? 'English' : 'Français'}</button></div>}
  </header>
}

/* ---------- phone ---------- */
function ChatScreen({ animate }: { animate: boolean }) {
  const t = useT()
  const [step, setStep] = useState(animate ? 0 : 4)
  useEffect(() => {
    if (!animate) return
    const timers: number[] = []
    const run = () => { setStep(0); [900, 2300, 3700, 5400].forEach((ms, i) => timers.push(window.setTimeout(() => setStep(i + 1), ms))); timers.push(window.setTimeout(run, 9500)) }
    run(); return () => timers.forEach(clearTimeout)
  }, [animate])
  return <>
    <div className="phone-head"><Mark small /><span>{t('Bonjour, Aïcha', 'Hi, Aïcha')} <b>✦</b></span><i>•••</i></div>
    <p className="phone-greeting">{t('Qu’est-ce qu’on fait', 'What shall we move')}<br />{t('avancer aujourd’hui ?', 'forward today?')}</p>
    {step >= 1 && <div className="msg user pop">{t('Rappelle-moi de réviser', 'Remind me to study')}<br /><b>{t('CSC305 demain à 15h.', 'CSC305 tomorrow at 3pm.')}</b></div>}
    {step === 2 && <div className="msg xena pop typing"><i /><i /><i /></div>}
    {step >= 3 && <div className="msg xena pop"><div className="xena-dot"><Mark small /></div><span>{t('Parfait, c’est noté.', 'Perfect, noted.')}<br />{t('Je te rappellerai demain à 15h.', 'I’ll remind you tomorrow at 3pm.')}</span></div>}
    {step >= 4 && <div className="reminder pop"><Bell size={15} /><span><b>{t('Révision · CSC305', 'Study · CSC305')}</b><small>{t('Demain, 15:00', 'Tomorrow, 3:00 PM')}</small></span><Check size={15} /></div>}
    <div className="phone-input">{t('Parle à Xena', 'Talk to Xena')} <span className="mic"><Mic size={15} /></span></div>
  </>
}
function Phone({ type = 'chat', className = '', animate = false }: { type?: 'chat' | 'study' | 'plan'; className?: string; animate?: boolean }) {
  const t = useT()
  const week = t('LMMJVSD', 'MTWTFSS').split('')
  return <div className={`phone ${className}`}><div className="phone-island" /><div className="phone-screen">
    {type === 'chat' && <ChatScreen animate={animate} />}
    {type === 'study' && <>
      <div className="phone-head"><span>{t('Mes études', 'My studies')}</span><i>•••</i></div>
      <p className="screen-title">{t('Ton rythme,', 'Your pace,')}<br /><b>{t('à ta mesure.', 'your way.')}</b></p>
      <div className="week">{week.map((d, i) => <span key={i} className={i === 2 ? 'active' : ''}>{d}</span>)}</div>
      <div className="progress-card"><small>{t('Cette semaine', 'This week')}</small><strong>4h 35</strong><div className="bars"><i /><i /><i /><i /><i /></div></div>
      <div className="subject"><span className="subject-icon cyan">◉</span><b>{t('Algorithmique', 'Algorithms')}</b><small>{t('En progression', 'Improving')}</small><em>68%</em></div>
      <div className="subject"><span className="subject-icon purple">◇</span><b>CSC305</b><small>{t('À revoir', 'To review')}</small><em>42%</em></div>
    </>}
    {type === 'plan' && <>
      <div className="phone-head"><span>{t('Mon planning', 'My schedule')}</span><i>•••</i></div>
      <p className="screen-title">{t('Mardi,', 'Tuesday,')}<br /><b>{t('8 octobre', 'October 8')}</b></p>
      <div className="plan-item"><span>09:00</span><i className="cyan" /><b>{t('Structure de données', 'Data structures')}<small>{t('Révision · 45 min', 'Review · 45 min')}</small></b></div>
      <div className="plan-item"><span>15:00</span><i className="purple" /><b>CSC305<small>{t('Révision', 'Review')}</small></b></div>
      <div className="plan-item"><span>18:00</span><i className="blue" /><b>{t('Mathématiques', 'Mathematics')}<small>{t('Exercices · 1h', 'Exercises · 1h')}</small></b></div>
      <button className="ask-xena"><Sparkles size={16} /> {t('Demander à Xena', 'Ask Xena')}</button>
    </>}
  </div></div>
}

/* ---------- sections ---------- */
function Hero() {
  const t = useT()
  const rotate = [t('plus simple', 'simpler'), t('mieux organisé', 'better organized'), t('plus serein', 'calmer'), t('plus constant', 'more consistent')]
  const [i, setI] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  useEffect(() => { const id = setInterval(() => setI(v => (v + 1) % 4), 2800); return () => clearInterval(id) }, [])
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const el = stage.current; if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -10}deg`)
    el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`)
  }
  const leave = () => { stage.current?.style.setProperty('--rx', '0deg'); stage.current?.style.setProperty('--ry', '0deg') }
  return <section id="top" className="hero">
    <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
    <div className="grid-bg" aria-hidden="true" />
    <div className="hero-inner">
      <div className="hero-copy">
        <div className="eyebrow enter" style={{ '--e': 0 } as CSSProperties}><span className="live" />{t('Le compagnon IA des étudiants', 'The AI companion for students')}</div>
        <h1 className="enter" style={{ '--e': 1 } as CSSProperties}>{t('Ton quotidien étudiant,', 'Your student life,')}<br /><span className="rotator"><span key={`${i}-${rotate[i]}`} className="grad-text word">{rotate[i]}</span></span><br />{t('avec Xena.', 'with Xena.')}</h1>
        <p className="lead enter" style={{ '--e': 2 } as CSSProperties}>{t('Xena t’aide à comprendre, organiser, planifier et rester constant — depuis une seule conversation.', 'Xena helps you understand, organize, plan and stay consistent — all from a single conversation.')}</p>
        <div className="enter" style={{ '--e': 3 } as CSSProperties}><StoreButtons /></div>
        <a className="discover enter" style={{ '--e': 4 } as CSSProperties} href="#how"><span className="discover-ring"><ArrowDown size={15} /></span>{t('Découvrir Xena', 'Discover Xena')}</a>
      </div>
      <div className="hero-visual" ref={stage} onMouseMove={move} onMouseLeave={leave}>
        <div className="hero-glow" /><div className="orbit orbit-one"><span /></div><div className="orbit orbit-two"><span /></div>
        <div className="star star-one">✦</div><div className="star star-two">✦</div>
        <div className="note note-top"><Sparkles size={17} /><span>{t('Une idée ?', 'An idea?')}<br /><b>{t('Je la retiens.', 'I’ll remember it.')}</b></span></div>
        <div className="tilt"><Phone className="hero-phone" animate /></div>
        <div className="note note-bottom"><CalendarDays size={17} /><span>{t('Demain · 15:00', 'Tomorrow · 3:00 PM')}<br /><b>{t('CSC305 · Révision', 'CSC305 · Study')}</b></span><Check size={16} /></div>
      </div>
    </div>
  </section>
}

function Marquee() {
  const t = useT()
  const words = [t('Rappels intelligents', 'Smart reminders'), t('Plans d’étude', 'Study plans'), t('Mémoire utile', 'Useful memory'), t('Suivi de progression', 'Progress tracking'), t('Révisions guidées', 'Guided revision'), t('Organisation', 'Organization'), t('Constance', 'Consistency')]
  return <div className="marquee" aria-hidden="true"><div className="marquee-track">{[...words, ...words, ...words].map((w, i) => <span key={i}><Sparkles size={14} />{w}</span>)}</div></div>
}

function Stats() {
  const t = useT()
  return <section className="stats">
    <Reveal className="stat"><strong><CountUp to={1} /></strong><span>{t('seule conversation pour tout gérer', 'single conversation to manage it all')}</span></Reveal>
    <Reveal className="stat" delay={100}><strong><CountUp to={0} /></strong><span>{t('formulaire à remplir', 'forms to fill in')}</span></Reveal>
    <Reveal className="stat" delay={200}><strong><CountUp to={24} suffix="/7" /></strong><span>{t('disponible quand tu en as besoin', 'available whenever you need it')}</span></Reveal>
    <Reveal className="stat" delay={300}><strong><CountUp to={3} /></strong><span>{t('étapes de la parole à l’action', 'steps from words to action')}</span></Reveal>
  </section>
}

function HowItWorks() {
  const t = useT()
  const items = [['01', t('Tu parles', 'You speak'), t('“Rappelle-moi de réviser CSC305 demain à 15h.”', '“Remind me to study CSC305 tomorrow at 3pm.”'), Mic], ['02', t('Xena comprend', 'Xena understands'), t('Elle saisit l’intention, le cours et le moment.', 'She grasps the intent, the course and the time.'), Sparkles], ['03', t('Xena agit', 'Xena acts'), t('Un rappel clair, au bon moment.', 'A clear reminder, at the right moment.'), Check]] as const
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  return <section id="how" className="section how">
    <Reveal className="section-intro"><p className="kicker">{t('Une IA qui avance avec toi', 'An AI that moves with you')}</p><h2>{t('Pas juste une IA ', 'Not just an AI ')}<span className="grad-text">{t('qui répond.', 'that answers.')}</span></h2><p className="sub">{t('Xena comprend ce que tu veux faire et t’aide à passer à l’action.', 'Xena understands what you want to do and helps you take action.')}</p></Reveal>
    <div className={`flow ${seen ? 'is-visible' : ''}`} ref={ref}>
      <div className="flow-line"><i /></div>
      {items.map(([n, ti, d, Icon], i) => <div className="flow-step" style={{ '--step': i } as CSSProperties} key={n}>
        <div className="flow-icon"><Icon size={22} /><span className="ping" /></div>
        <span className="flow-num">{n}</span><h3>{ti}</h3><p>{d}</p>
      </div>)}
    </div>
  </section>
}

function Features() {
  const t = useT()
  const data = [
    { title: t('Rappels intelligents', 'Smart reminders'), text: t('Dis ce que tu dois faire. Xena crée le bon rappel, sans formulaire.', 'Say what you need to do. Xena creates the right reminder, no form needed.'), icon: Bell },
    { title: t('Plans d’étude', 'Study plans'), text: t('Organise tes révisions selon tes cours, ton temps et tes objectifs.', 'Organize your revision around your courses, your time and your goals.'), icon: CalendarDays },
    { title: t('Mémoire utile', 'Useful memory'), text: t('Garde une information importante près de toi, et retrouve-la quand il faut.', 'Keep important information close, and find it when you need it.'), icon: Sparkles },
    { title: t('Suivi d’étude', 'Study tracking'), text: t('Vois tes matières, tes difficultés et ta progression sans te perdre.', 'See your subjects, your struggles and your progress without getting lost.'), icon: BookOpen },
  ]
  return <section id="features" className="section features">
    <Reveal className="feature-heading"><p className="kicker">{t('Pensé pour la vraie vie étudiante', 'Built for real student life')}</p><h2>{t('Tout avance', 'Everything moves')}<br />{t('dans la ', 'in the ')}<span className="grad-text">{t('même conversation.', 'same conversation.')}</span></h2></Reveal>
    <div className="feature-grid">
      {data.map(({ title, text, icon: Icon }, i) => <Reveal key={i} delay={i * 110} className={`feature-wrap f${i}`}>
        <article className="feature" onMouseMove={spotlight}>
          <div className={`feature-icon c${i}`}><Icon size={22} /></div>
          <h3>{title}</h3><p>{text}</p>
          <span className="feature-index">0{i + 1}</span><ArrowUpRight className="feature-arrow" size={18} />
        </article>
      </Reveal>)}
    </div>
  </section>
}

function Guide() {
  const t = useT()
  return <section id="guide" className="section guide">
    <Reveal className="guide-copy">
      <p className="kicker">{t('Un guide, pas une distraction', 'A guide, not a distraction')}</p>
      <h2>{t('Xena t’arrête, puis te ', 'Xena stops you, then ')}<span className="grad-text">{t('montre le chemin.', 'shows you the way.')}</span></h2>
      <p className="sub">{t('Quand tu te disperses, Xena pose la main sur ton téléphone et te ramène vers ce qui compte vraiment.', 'When you get distracted, Xena gently stops your hand and brings you back to what truly matters.')}</p>
      <ul className="guide-points"><li><Check size={16} />{t('Une priorité à la fois', 'One priority at a time')}</li><li><Check size={16} />{t('Un rappel au bon moment', 'A reminder at the right moment')}</li></ul>
    </Reveal>
    <Reveal className="guide-visual" delay={150}>
      <div className="guide-frame"><img src="/robot-guide.jpg" alt={t('Un robot blanc et noir arrête doucement la main d’un étudiant et lui montre le chemin', 'A black and white robot gently stops a student’s hand and shows them the way')} loading="lazy" /></div>
      <div className="note guide-note"><Sparkles size={16} /><span>{t('Pause.', 'Pause.')}<br /><b>{t('Voici la suite.', 'Here’s what’s next.')}</b></span></div>
    </Reveal>
  </section>
}

function Screens() {
  const t = useT()
  return <section id="xena" className="section screens">
    <Reveal className="screens-header"><p className="kicker">{t('Xena, au quotidien', 'Xena, every day')}</p><h2>{t('Un espace calme pour', 'A calm space to')}<br /><span className="grad-text">{t('rester sur le bon rythme.', 'stay on the right pace.')}</span></h2></Reveal>
    <Reveal className="phones-row">
      <Phone type="study" className="side-phone left" /><Phone type="chat" className="center-phone" animate /><Phone type="plan" className="side-phone right" />
    </Reveal>
    <div className="screen-labels"><span>{t('Ton suivi', 'Your progress')}</span><span>{t('Ta conversation', 'Your chat')}</span><span>{t('Ton planning', 'Your schedule')}</span></div>
  </section>
}

function BrandStatement() {
  const t = useT()
  const [ref, seen] = useInView<HTMLElement>(0.3)
  const words = [t('L’étudiant', 'The student'), t('parle.', 'speaks.')]
  const words2 = ['Xena', t('coordonne.', 'coordinates.')]
  const chips: [string, typeof Bell][] = [[t('Rappel créé', 'Reminder created'), Bell], [t('Planning mis à jour', 'Schedule updated'), CalendarDays], [t('Révision organisée', 'Revision organized'), BookOpen]]
  return <section ref={ref} className={`statement ${seen ? 'is-visible' : ''}`} onMouseMove={spotlight}>
    <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
    <div className="statement-grid" aria-hidden="true" />
    <div className="statement-rings" aria-hidden="true"><i /><i /><i /></div>
    <div className="statement-inner">
      <p className="statement-kicker"><Sparkles size={14} /> {t('Notre promesse', 'Our promise')}</p>
      <p className="statement-title" key={words[0]}>{words.map((w, i) => <span className="w" style={{ '--i': i } as CSSProperties} key={w}>{w}&nbsp;</span>)}<br />{words2.map((w, i) => <span className="w grad-text" style={{ '--i': i + 2 } as CSSProperties} key={w}>{w}&nbsp;</span>)}</p>
      <div className="statement-flow">
        <div className="voice-pill"><span className="voice-mic"><Mic size={18} /></span><span className="wave">{Array.from({ length: 14 }).map((_, i) => <i key={i} style={{ '--k': i } as CSSProperties} />)}</span><em>{t('« Rappelle-moi de réviser… »', '“Remind me to study…”')}</em></div>
        <div className="flow-core"><Sparkles size={22} /></div>
        <div className="chip-stack">{chips.map(([label, Icon], i) => <div className="chip" style={{ '--c': i } as CSSProperties} key={i}><Icon size={15} />{label}<Check size={14} className="chip-check" /></div>)}</div>
      </div>
    </div>
    <div className="statement-star">✦</div>
  </section>
}

/* FAQ shared with the chatbot */
const FAQS: { q: [string, string]; a: [string, string] }[] = [
  { q: ['Qu’est-ce que Xena ?', 'What is Xena?'], a: ['Xena est un compagnon IA pour étudiants : il t’aide à comprendre, organiser, planifier et rester constant, depuis une seule conversation.', 'Xena is an AI companion for students: it helps you understand, organize, plan and stay consistent, all from a single conversation.'] },
  { q: ['Comment créer un rappel ?', 'How do I create a reminder?'], a: ['Dis-le simplement, par exemple « Rappelle-moi de réviser CSC305 demain à 15h ». Xena comprend et crée le rappel pour toi.', 'Just say it, for example “Remind me to study CSC305 tomorrow at 3pm”. Xena understands and creates the reminder for you.'] },
  { q: ['Sur quels appareils Xena est-elle disponible ?', 'Which devices is Xena available on?'], a: ['Xena arrive sur Google Play et sur l’App Store. Les liens de téléchargement seront ajoutés très bientôt.', 'Xena is coming to Google Play and the App Store. Download links will be added very soon.'] },
]
function FAQ() {
  const t = useT()
  const { lang } = useLang()
  const i18 = lang === 'fr' ? 0 : 1
  const [open, setOpen] = useState(0)
  return <section id="faq" className="section faq">
    <Reveal className="faq-head"><p className="kicker">{t('Questions fréquentes', 'Frequently asked questions')}</p><h2>{t('Tu te poses ', 'Got ')}<span className="grad-text">{t('des questions ?', 'questions?')}</span></h2></Reveal>
    <Reveal className="faq-list" delay={120}>
      {FAQS.map((f, i) => <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
        <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}><span>{f.q[i18]}</span><Plus size={18} /></button>
        <div className="faq-body"><p>{f.a[i18]}</p></div>
      </div>)}
    </Reveal>
  </section>
}

function FinalCTA() {
  const t = useT()
  return <section id="download" className="final">
    <div className="aurora soft" aria-hidden="true"><i /><i /><i /></div>
    <Reveal><p className="kicker">{t('Prête quand tu l’es', 'Ready when you are')}</p><h2>{t('Commence avec ', 'Start with ')}<span className="grad-text">Xena.</span></h2><p className="sub">{t('Ton quotidien étudiant mérite plus qu’un chatbot.', 'Your student life deserves more than a chatbot.')}</p><StoreButtons /></Reveal>
  </section>
}
function Footer() {
  const t = useT()
  return <footer><div className="footer-top"><div className="footer-brand"><Wordmark /><p>{t('Le compagnon IA des étudiants.', 'The AI companion for students.')}</p><Socials /></div><div className="footer-links"><a href="#xena">{t('Produit', 'Product')}</a><a href="#features">{t('Fonctionnalités', 'Features')}</a><a href="#top">{t('Confidentialité', 'Privacy')}</a><a href="#top">{t('Conditions', 'Terms')}</a><a href="mailto:contact@xena.ai">Contact</a></div></div><small>© 2026 Xena AI</small></footer>
}

/* ---------- chatbot ---------- */
type Pair = [string, string]
const INTENTS: { keys: string[]; a: Pair }[] = [
  { keys: ['bonjour', 'salut', 'coucou', 'hello', 'hi', 'hey'], a: ['Bonjour ! 👋 Je suis l’assistant de Xena. Posez-moi vos questions sur l’app.', 'Hello! 👋 I’m Xena’s assistant. Ask me anything about the app.'] },
  { keys: ['merci', 'thanks', 'thank'], a: ['Avec plaisir ! N’hésitez pas si vous avez d’autres questions. ✨', 'You’re welcome! Feel free to ask if you have more questions. ✨'] },
  { keys: ['rappel', 'remind', 'reminder', 'alarme', 'notification'], a: FAQS[1].a },
  { keys: ['telecharg', 'download', 'app store', 'google play', 'android', 'ios', 'iphone', 'disponible', 'available', 'install', 'appareil', 'device'], a: FAQS[2].a },
  { keys: ['prix', 'gratuit', 'tarif', 'combien', 'abonnement', 'price', 'free', 'cost', 'pricing', 'subscription'], a: ['Les informations sur les tarifs seront communiquées au lancement de l’app. Restez à l’écoute !', 'Pricing details will be shared when the app launches. Stay tuned!'] },
  { keys: ['plan', 'revision', 'etude', 'etudier', 'planning', 'study', 'schedule', 'review', 'organis'], a: ['Xena organise tes révisions selon tes cours, ton temps et tes objectifs, puis te suit dans ta progression.', 'Xena organizes your revision around your courses, your time and your goals, then tracks your progress.'] },
  { keys: ['memoire', 'memory', 'retenir', 'remember', 'note'], a: ['Avec la mémoire utile, Xena garde une information importante près de toi et te la rappelle quand il le faut.', 'With useful memory, Xena keeps important information close and brings it back when you need it.'] },
  { keys: ['langue', 'language', 'francais', 'anglais', 'english', 'french'], a: ['Le site est disponible en français et en anglais : utilisez le bouton de langue en bas à droite.', 'The site is available in French and English: use the language button at the bottom right.'] },
  { keys: ['donnees', 'securite', 'confidential', 'privacy', 'data', 'security', 'prive'], a: ['Votre vie privée compte. Les détails seront disponibles dans la page Confidentialité.', 'Your privacy matters. Details will be available on the Privacy page.'] },
  { keys: ['contact', 'email', 'mail', 'support', 'aide', 'help', 'joindre', 'reach'], a: ['Vous pouvez nous écrire à contact@xena.ai ou nous suivre sur nos réseaux sociaux (bas de page).', 'You can write to us at contact@xena.ai or follow us on social media (page footer).'] },
  { keys: ['xena', 'quoi', 'what', 'qui', 'who', 'fonction', 'feature', 'faire', 'does', 'marche', 'work'], a: FAQS[0].a },
]
const FALLBACK: Pair = ['Je ne suis pas sûr de bien comprendre. Essayez : « Qu’est-ce que Xena ? », « Comment créer un rappel ? » ou écrivez à contact@xena.ai.', 'I’m not sure I understand. Try: “What is Xena?”, “How do I create a reminder?” or write to contact@xena.ai.']
const SUGGESTIONS: Pair[] = [['Qu’est-ce que Xena ?', 'What is Xena?'], ['Comment créer un rappel ?', 'How do I create a reminder?'], ['Où télécharger l’app ?', 'Where can I download the app?'], ['Quels sont les tarifs ?', 'What is the pricing?']]
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
function answer(q: string): Pair {
  const n = norm(q); let best: { score: number; a: Pair } | null = null
  for (const it of INTENTS) { const score = it.keys.reduce((s, k) => s + (n.includes(k) ? k.length : 0), 0); if (score && (!best || score > best.score)) best = { score, a: it.a } }
  return best ? best.a : FALLBACK
}
type Msg = { from: 'bot'; text: Pair } | { from: 'user'; text: string }

function ChatWidget() {
  const t = useT()
  const { lang } = useLang()
  const i18 = lang === 'fr' ? 0 : 1
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: ['Bonjour ! Je suis l’assistant Xena. Comment puis-je vous aider ?', 'Hi! I’m the Xena assistant. How can I help you?'] }])
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs, typing, open])
  const send = (text: string) => {
    const q = text.trim(); if (!q || typing) return
    setMsgs(m => [...m, { from: 'user', text: q }]); setInput(''); setTyping(true)
    window.setTimeout(() => { setMsgs(m => [...m, { from: 'bot', text: answer(q) }]); setTyping(false) }, 700 + Math.random() * 500)
  }
  const submit = (e: FormEvent) => { e.preventDefault(); send(input) }
  return <>
    <div className={`chat-panel ${open ? 'open' : ''}`} role="dialog" aria-label={t('Assistant Xena', 'Xena assistant')} aria-hidden={!open}>
      <div className="chat-head">
        <span className="chat-avatar"><Bot size={20} /></span>
        <div><b>{t('Assistant Xena', 'Xena assistant')}</b><small><i className="live" />{t('En ligne', 'Online')}</small></div>
        <button onClick={() => setOpen(false)} aria-label={t('Fermer le chat', 'Close chat')}><X size={18} /></button>
      </div>
      <div className="chat-body">
        {msgs.map((m, i) => <div key={i} className={`bubble ${m.from}`}>{m.from === 'bot' ? m.text[i18] : m.text}</div>)}
        {typing && <div className="bubble bot typing"><i /><i /><i /></div>}
        {msgs.length === 1 && <div className="chat-suggest">{SUGGESTIONS.map((s, i) => <button key={i} onClick={() => send(s[i18])}>{s[i18]}</button>)}</div>}
        <div ref={end} />
      </div>
      <form className="chat-form" onSubmit={submit}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder={t('Posez votre question…', 'Ask your question…')} aria-label={t('Votre message', 'Your message')} tabIndex={open ? 0 : -1} />
        <button type="submit" aria-label={t('Envoyer', 'Send')} disabled={!input.trim() || typing}><Send size={17} /></button>
      </form>
    </div>
    <button className={`chat-fab ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label={open ? t('Fermer le chat', 'Close chat') : t('Ouvrir le chat avec Xena', 'Open chat with Xena')}>
      <span className="fab-ring" /><MessageCircle className="fab-icon i-chat" size={26} /><X className="fab-icon i-close" size={26} />
    </button>
  </>
}

function FloatingLang() {
  const { lang, setLang } = useLang()
  return <div className="lang-fab" role="group" aria-label="Language / Langue">
    <button className={lang === 'fr' ? 'on' : ''} onClick={() => setLang('fr')} aria-pressed={lang === 'fr'}>FR</button>
    <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>EN</button>
    <span className="lang-thumb" style={{ transform: `translateX(${lang === 'fr' ? 0 : 100}%)` }} />
  </div>
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('xena-theme') ? localStorage.getItem('xena-theme') === 'dark' : true)
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('xena-lang') as Lang) || 'fr')
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('xena-theme', dark ? 'dark' : 'light') }, [dark])
  useEffect(() => { document.documentElement.lang = lang; localStorage.setItem('xena-lang', lang) }, [lang])
  return <LangCtx.Provider value={{ lang, setLang }}>
    <Navbar dark={dark} setDark={setDark} />
    <main><Hero /><Marquee /><Stats /><HowItWorks /><Features /><Guide /><Screens /><BrandStatement /><FAQ /><FinalCTA /></main>
    <Footer />
    <div className="fab-stack"><ChatWidget /></div>
  </LangCtx.Provider>
}
