import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { categories, heroSlides, menuSections, reasons, siteConfig } from './data/menu'

const HERO_BACKGROUND_IMAGE = './images/hero-drinks.jpg'
const MENU_IMAGE = './images/hero-waffles.png'

function Icon({ name, size = 24 }) {
  const shared = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    waffle: <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="m5.5 8 13 8M12 4v16M5.5 16l13-8" /></>,
    cloud: <><path d="M7 18.5h10a4 4 0 0 0 .8-7.9A5.8 5.8 0 0 0 7.1 9.2 4.7 4.7 0 0 0 7 18.5Z" /><path d="M12 3v3M5.5 5.5l2.1 2.1M18.5 5.5l-2.1 2.1" /></>,
    cold: <><path d="M8 3h8l-1 18H9L8 3Z" /><path d="M7 7h10M10 11h4M11 3V1" /><path d="M6 21h12" /></>,
    sparkle: <><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z" /><path d="m19 17 .6 2.4L22 20l-2.4.6L19 23l-.6-2.4L16 20l2.4-.6L19 17Z" /></>,
    gift: <><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18M12 8H7.5a2.3 2.3 0 1 1 2.3-2.3C9.8 7 12 8 12 8Zm0 0h4.5a2.3 2.3 0 1 0-2.3-2.3C14.2 7 12 8 12 8Z" /></>,
    leaf: <><path d="M20 4C11 4 5 8.5 5 16c0 2.4 1.7 4 4 4 7.5 0 11-6 11-16Z" /><path d="M4 21c3.2-5.2 7-8.6 12-11" /></>,
    heart: <path d="M20.8 8.1c0 5.1-8.8 10.5-8.8 10.5S3.2 13.2 3.2 8.1a4.5 4.5 0 0 1 8-2.8l.8.9.8-.9a4.5 4.5 0 0 1 8 2.8Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    arrowLeft: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    arrowDown: <><path d="M12 4v16" /><path d="m6 14 6 6 6-6" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    coffeeBean: <><path d="M19.2 4.8c-4-3.9-10.4-2.1-13.3 2.2-2.9 4.4-1.5 10.6 2.7 12.6 4.1 2 9.4-.5 11.3-5 1.8-4.3 1.2-7.5-.7-9.7Z" /><path d="M7 17c2.2-3.3 4.9-6.5 8.9-9.3" /></>,
    bubbles: <><circle cx="7" cy="7" r="2.5" /><circle cx="16.5" cy="6.5" r="3.5" /><circle cx="14" cy="16" r="4.5" /><circle cx="5.5" cy="17.5" r="1.5" /></>,
    matcha: <><path d="M5 10h14l-1.2 9H6.2L5 10Z" /><path d="M4 10h16M9 6.5c1.7-2.6 4.3-3.3 6.6-2.8-.5 2.4-2.6 4.5-5.5 4.2" /><path d="M12 8.8c.1-1.6.9-3.1 2.1-4.3" /></>,
    ube: <><path d="M6.2 9.1c.5-3.5 3.6-5.7 7.2-5.1 3.5.5 5.7 3.8 5.1 7.3-.5 3.2-3.2 5.6-6.4 5.2-3-.3-5.1-3-4.7-6 .3-2.5 2.6-4.1 4.9-3.7" /><path d="M5.5 14.5c-2.1 1-3.1 3.5-2.1 5.6M17 16.5c1.3 1.7 3.8 2 5.5.8" /><path d="M10.2 11.3c1.3-1 3.1-.5 3.8.9.7 1.4.1 3.1-1.3 3.8" /></>,
    instagram: <><rect x="3.3" y="3.3" width="17.4" height="17.4" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.6" cy="6.6" r=".9" fill="currentColor" stroke="none" /></>,
    tiktok: <path d="M14.4 3c.3 2.2 1.5 3.8 3.9 4.1v3.2c-1.4 0-2.7-.4-3.8-1.2v6.8c0 4.3-4.8 6.1-7.6 3.4-2.9-2.8-1.1-7.9 3-7.9.4 0 .7 0 1.1.1v3.2c-.4-.1-.8-.2-1.2-.1-1.5.3-2.1 2.2-1.2 3.4 1.3 1.7 4.3.6 4.3-1.7V3h2.5Z" fill="currentColor" stroke="none" />,
    linkedin: <><rect x="4" y="9" width="3.2" height="11" rx=".4" fill="currentColor" stroke="none" /><circle cx="5.6" cy="5.4" r="1.8" fill="currentColor" stroke="none" /><path d="M10 20V9h3v1.5c.7-1.1 1.8-1.8 3.5-1.8 2.8 0 3.5 1.9 3.5 4.4V20h-3.2v-6c0-1.4 0-2.6-1.6-2.6S13.3 12.6 13.3 14v6H10Z" fill="currentColor" stroke="none" /></>,
    whatsapp: <><path d="M20.3 11.7a8.2 8.2 0 0 1-12.1 7.2L3.7 20l1.2-4.3A8.2 8.2 0 1 1 20.3 11.7Z" /><path d="M8.5 7.8c.2-.5.4-.5.8-.5h.6c.2 0 .4 0 .5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c.5 1 1.2 1.8 2.2 2.3l.7-.7c.2-.2.4-.2.7-.1l1.7.8c.3.1.4.3.4.5v.6c0 .4-.2.7-.6.9-.4.2-1.1.4-2.1.1-1.1-.3-2.4-1.1-3.6-2.4-1.2-1.3-2-2.6-2.3-3.7-.3-1-.1-1.7.1-2.1Z" fill="currentColor" stroke="none" /></>,
  }
  return <svg {...shared}>{paths[name]}</svg>
}

function BrandMark({ footer = false }) {
  return <img className={footer ? 'brand-mark brand-mark--footer' : 'brand-mark'} src="./images/bewraped-wordmark-red.png" alt="Bewraped." />
}

function SocialLink({ icon, label, href }) {
  const isReady = Boolean(href)
  return <a className={isReady ? 'social-link' : 'social-link is-pending'} href={href || '#'} target={isReady ? '_blank' : undefined} rel={isReady ? 'noreferrer' : undefined} aria-label={isReady ? `Visit Bewraped on ${label}` : `${label} link coming soon`} aria-disabled={!isReady} onClick={(event) => { if (!isReady) event.preventDefault() }}><Icon name={icon} size={23} /></a>
}

function MenuCard({ item }) {
  return (
    <article className="menu-card">
      <div className="menu-card__image">
        <img src={MENU_IMAGE} alt="A Bewraped bubble waffle and cold brew" style={{ objectPosition: item.position }} />
        <span className="menu-card__tag">Signature</span>
      </div>
      <div className="menu-card__body">
        <div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
        <div className="menu-card__bottom">
          <strong>{item.price}</strong>
          <a href={siteConfig.orderUrl} aria-label={`Order ${item.name}`}>Order <Icon name="arrow" size={16} /></a>
        </div>
      </div>
    </article>
  )
}

function ContactModal({ onClose, formValues, onChange, onSubmit, status }) {
  const isSending = status === 'submitting'

  return (
    <div className="contact-modal__backdrop" onMouseDown={onClose}>
      <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-form-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="contact-modal__close" type="button" aria-label="Close contact form" onClick={onClose}><Icon name="close" size={20} /></button>
        {status === 'success' ? (
          <div className="contact-modal__success">
            <p className="eyebrow eyebrow--red">Message received</p>
            <h2 id="contact-form-title">Thank you!</h2>
            <p>We have received your details and sent a confirmation to your email. Bewraped will be in touch soon.</p>
            <button className="button" type="button" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <p className="eyebrow eyebrow--red">Get in touch</p>
            <h2 id="contact-form-title">Let's make it sweet.</h2>
            <p className="contact-modal__intro">Leave your details and we will get back to you soon.</p>
            <form className="contact-form" onSubmit={onSubmit}>
              <label htmlFor="contact-name">Name<input id="contact-name" name="name" autoComplete="name" value={formValues.name} onChange={onChange} required /></label>
              <label htmlFor="contact-number">Contact number<input id="contact-number" name="contact" type="tel" autoComplete="tel" value={formValues.contact} onChange={onChange} required /></label>
              <label htmlFor="contact-email">Email<input id="contact-email" name="email" type="email" autoComplete="email" value={formValues.email} onChange={onChange} required /></label>
              <label className="form-trap" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" value={formValues.website} onChange={onChange} /></label>
              {status === 'configuration' && <p className="contact-form__notice" role="alert">The email connection is being set up. Please try again shortly.</p>}
              {status === 'error' && <p className="contact-form__notice" role="alert">We could not send your details. Please try again.</p>}
              <button className="button" type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send my details'} <Icon name="arrow" size={18} /></button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}

function SubscribeForm({ email, onChange, onSubmit, status }) {
  const isSending = status === 'submitting'

  if (status === 'success') {
    return <p className="subscribe-form__success" role="status"><span><Icon name="sparkle" size={18} /></span>You are on the list. Check your inbox for a little hello from Bewraped.</p>
  }

  return (
    <form className="subscribe-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="subscribe-email">Your email address</label>
      <input id="subscribe-email" name="email" type="email" autoComplete="email" placeholder="Your email address" value={email} onChange={onChange} required />
      <button className="button button--gold" type="submit" disabled={isSending}>{isSending ? 'Joining...' : 'Subscribe'} <Icon name="arrow" size={18} /></button>
      {status === 'configuration' && <p className="subscribe-form__notice" role="alert">Subscriptions are being set up. Please try again shortly.</p>}
      {status === 'error' && <p className="subscribe-form__notice" role="alert">We could not add you right now. Please try again.</p>}
    </form>
  )
}

function WelcomeModal({ onClose, onSubscribe }) {
  return (
    <div className="welcome-modal__backdrop" onMouseDown={onClose}>
      <section className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="welcome-modal__close" type="button" aria-label="Close welcome message" onClick={onClose}><Icon name="close" size={20} /></button>
        <div className="welcome-modal__visual" aria-hidden="true"><img src="./images/bewraped-icon-off-white.png" alt="" /></div>
        <div className="welcome-modal__content">
          <p className="eyebrow eyebrow--red">Welcome to Bewraped</p>
          <h2 id="welcome-modal-title">A little sweetness, straight to your inbox.</h2>
          <p>Get first taste of new flavours, pop-ups, and sweet little perks.</p>
          <button className="button" type="button" onClick={onSubscribe}>Join the list <Icon name="arrow" size={18} /></button>
        </div>
      </section>
    </div>
  )
}

const pageNames = new Set(['home', 'about', 'menu', 'contact'])

function getPageFromHash() {
  const page = window.location.hash.replace(/^#\/?/, '').toLowerCase()
  return pageNames.has(page) ? page : 'home'
}

function App() {
  const mainRef = useRef(null)
  const heroCopyRef = useRef(null)
  const wasReloaded = useRef(window.performance?.getEntriesByType('navigation').some((entry) => entry.type === 'reload')).current
  const [activeSlide, setActiveSlide] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [page, setPage] = useState(() => wasReloaded ? 'home' : getPageFromHash())
  const [activeSection, setActiveSection] = useState(() => !wasReloaded && window.location.hash.toLowerCase().includes('#about-details') ? 'about' : '')
  const [contactFormOpen, setContactFormOpen] = useState(false)
  const [contactStatus, setContactStatus] = useState('idle')
  const [contactForm, setContactForm] = useState({ name: '', contact: '', email: '', website: '' })
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState('idle')
  const [welcomeOpen, setWelcomeOpen] = useState(() => wasReloaded || getPageFromHash() === 'home')
  const [subscribeReached, setSubscribeReached] = useState(false)
  const slide = heroSlides[activeSlide]

  useEffect(() => {
    if (!wasReloaded) return
    window.history.replaceState(null, '', '#/home')
    window.scrollTo(0, 0)
  }, [wasReloaded])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const copyItems = heroCopyRef.current?.querySelectorAll('.hero-copy-motion')
    if (!copyItems?.length) return undefined
    const animation = gsap.fromTo(copyItems, { autoAlpha: 0, x: -28 }, { autoAlpha: 1, x: 0, duration: .58, stagger: .11, ease: 'power3.out', clearProps: 'transform' })
    return () => animation.kill()
  }, [activeSlide])

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 2000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!contactFormOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setContactFormOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [contactFormOpen])

  useEffect(() => {
    if (!welcomeOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setWelcomeOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [welcomeOpen])

  useEffect(() => {
    const subscribeSection = document.getElementById('subscribe')
    if (!subscribeSection) return undefined

    const updateSubscribeJump = () => {
      const triggerPoint = subscribeSection.offsetTop - window.innerHeight * .45
      setSubscribeReached(window.scrollY >= triggerPoint)
    }

    updateSubscribeJump()
    window.addEventListener('scroll', updateSubscribeJump, { passive: true })
    window.addEventListener('resize', updateSubscribeJump)
    return () => {
      window.removeEventListener('scroll', updateSubscribeJump)
      window.removeEventListener('resize', updateSubscribeJump)
    }
  }, [page])

  useEffect(() => {
    const updatePage = () => {
      const nextPage = getPageFromHash()
      if (nextPage === 'about') {
        window.location.replace('#/home#about-details')
        return
      }
      setPage(nextPage)
      setActiveSection(nextPage === 'home' && window.location.hash.toLowerCase().includes('#about-details') ? 'about' : '')
      setMenuOpen(false)
    }
    updatePage()
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  useEffect(() => {
    const section = window.location.hash.split('#')[1]
    if (page === 'home' && section === 'about-details') {
      window.requestAnimationFrame(() => document.getElementById('about-details')?.scrollIntoView({ behavior: 'smooth' }))
      return
    }
    window.scrollTo(0, 0)
  }, [page])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return undefined

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray('main > section')
      gsap.fromTo(sections, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: .7, stagger: .1, ease: 'power3.out', clearProps: 'transform' })

      const cards = gsap.utils.toArray('.category-card, .menu-card')
      const removeListeners = cards.map((card) => {
        const tiltCard = (event) => {
          const bounds = card.getBoundingClientRect()
          const x = (event.clientX - bounds.left) / bounds.width - .5
          const y = (event.clientY - bounds.top) / bounds.height - .5
          gsap.to(card, { rotateX: -y * 5, rotateY: x * 5, y: -5, duration: .35, ease: 'power2.out', overwrite: 'auto' })
        }
        const resetCard = () => gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: .45, ease: 'power3.out', overwrite: 'auto' })
        card.addEventListener('pointermove', tiltCard)
        card.addEventListener('pointerleave', resetCard)
        return () => {
          card.removeEventListener('pointermove', tiltCard)
          card.removeEventListener('pointerleave', resetCard)
        }
      })

      gsap.fromTo('.subscribe-doodle', { autoAlpha: 0, scale: .75, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .65, stagger: .08, ease: 'back.out(1.5)', delay: .18 })

      return () => removeListeners.forEach((remove) => remove())
    }, mainRef)

    return () => context.revert()
  }, [page])

  const selectSlide = (index) => setActiveSlide((index + heroSlides.length) % heroSlides.length)
  const closeMenu = () => setMenuOpen(false)
  const goHome = () => {
    closeMenu()
    setActiveSection('')
    if (page === 'home') window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }
  const goToAbout = (event) => {
    event.preventDefault()
    closeMenu()
    setActiveSection('about')
    if (page !== 'home') {
      window.location.hash = '#/home#about-details'
      return
    }
    window.history.replaceState(null, '', '#/home#about-details')
    window.requestAnimationFrame(() => document.getElementById('about-details')?.scrollIntoView({ behavior: 'smooth' }))
  }
  const goToSubscribe = () => {
    closeMenu()
    document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' })
  }
  const goToTop = () => {
    closeMenu()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const openSubscribeFromWelcome = () => {
    setWelcomeOpen(false)
    window.requestAnimationFrame(goToSubscribe)
  }
  const openContactForm = () => {
    setContactStatus('idle')
    setContactFormOpen(true)
  }
  const closeContactForm = () => setContactFormOpen(false)
  const updateContactForm = (event) => setContactForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submitContactForm = async (event) => {
    event.preventDefault()
    if (!siteConfig.contactFormEndpoint) {
      setContactStatus('configuration')
      return
    }

    setContactStatus('submitting')
    try {
      await fetch(siteConfig.contactFormEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...contactForm, source: window.location.href, submittedAt: new Date().toISOString() }),
      })
      setContactForm({ name: '', contact: '', email: '', website: '' })
      setContactStatus('success')
    } catch {
      setContactStatus('error')
    }
  }
  const updateSubscribeEmail = (event) => {
    setSubscribeEmail(event.target.value)
    if (subscribeStatus !== 'idle') setSubscribeStatus('idle')
  }
  const isAboutSection = page === 'home' && activeSection === 'about'
  const submitSubscribeForm = async (event) => {
    event.preventDefault()
    if (!siteConfig.contactFormEndpoint) {
      setSubscribeStatus('configuration')
      return
    }

    setSubscribeStatus('submitting')
    const subscriberName = subscribeEmail.split('@')[0].replace(/[._-]+/g, ' ').trim() || 'Bewraped friend'
    try {
      await fetch(siteConfig.contactFormEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ name: subscriberName, contact: 'Newsletter subscriber', email: subscribeEmail, website: '', enquiryType: 'newsletter subscription', source: window.location.href, submittedAt: new Date().toISOString() }),
      })
      setSubscribeEmail('')
      setSubscribeStatus('success')
    } catch {
      setSubscribeStatus('error')
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="site-chrome">
        <div className="announcement"><span>{siteConfig.announcement}</span></div>
        <header className="site-header">
          <a className="brand" href="#/home" aria-label="Bewraped home" onClick={goHome}><BrandMark /></a>
          <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
          <nav className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
            <a className={page === 'home' && !isAboutSection ? 'is-active' : undefined} href="#/home" aria-current={page === 'home' && !isAboutSection ? 'page' : undefined} onClick={goHome}>Home</a>
            <a className={isAboutSection ? 'is-active' : undefined} href="#/home#about-details" aria-current={isAboutSection ? 'page' : undefined} onClick={goToAbout}>About</a>
            <a className={page === 'menu' ? 'is-active' : undefined} href="#/menu" aria-current={page === 'menu' ? 'page' : undefined} onClick={closeMenu}>Menu</a>
            <a className={page === 'contact' ? 'is-active' : undefined} href="#/contact" aria-current={page === 'contact' ? 'page' : undefined} onClick={closeMenu}>Contact</a>
            <a className="nav-order" href={siteConfig.orderUrl} onClick={closeMenu}>Order now <Icon name="arrow" size={16} /></a>
          </nav>
        </header>
      </div>

      <main id="main" ref={mainRef}>
        {page === 'home' && <>
          <section className="hero" style={{ backgroundImage: `url(${HERO_BACKGROUND_IMAGE})` }}>
            <div className="hero__content" ref={heroCopyRef}>
              <p className="eyebrow hero-copy-motion">{slide.eyebrow}</p>
              <h1 className="hero-copy-motion">{slide.title}</h1>
              <p className="hero__copy hero-copy-motion">{slide.description}</p>
              <a className="button button--cream" href={slide.target}>{slide.cta} <Icon name="arrow" size={18} /></a>
            </div>
            <div className="hero__controls" aria-label="Hero slides">
              <button onClick={() => selectSlide(activeSlide - 1)} aria-label="Previous slide"><Icon name="arrowLeft" size={18} /></button>
              <div className="hero__dots">
                {heroSlides.map((heroSlide, index) => <button key={heroSlide.title} className={index === activeSlide ? 'is-active' : ''} onClick={() => selectSlide(index)} aria-label={`Show slide ${index + 1}`} aria-current={index === activeSlide ? 'true' : undefined} />)}
              </div>
              <button onClick={() => selectSlide(activeSlide + 1)} aria-label="Next slide"><Icon name="arrow" size={18} /></button>
            </div>
          </section>

          <section className="intro section" aria-labelledby="intro-title">
            <p className="eyebrow eyebrow--red">Your comfort order</p>
            <h2 id="intro-title">One little stop. A lot to love.</h2>
            <p className="section-lead">Start with a warm bubble waffle, then find the brew that matches your mood.</p>
            <div className="category-grid">
              {categories.map((category) => <a className="category-card" href={category.target} key={category.title}><span className="category-card__icon"><Icon name={category.icon} size={34} /></span><h3>{category.title}</h3><p>{category.copy}</p><span className="category-card__link">Explore <Icon name="arrow" size={16} /></span></a>)}
            </div>
          </section>

          <section className="page-intro section about-home" id="about-details" aria-labelledby="about-title"><p className="eyebrow eyebrow--red">About Bewraped</p><h2 id="about-title">Sweet moments, thoughtfully made.</h2><p>Bewraped is all about fresh bubble waffles, small-batch brews, and easy treats made for the people you share them with.</p></section>
          <section className="why section" aria-labelledby="why-title">
            <div className="section-heading section-heading--split"><div><p className="eyebrow eyebrow--red">Why Bewraped?</p><h2 id="why-title">Good mood food, wrapped up right.</h2></div><p>We keep the menu simple: fresh waffle batter, thoughtful toppings, and brews that make you want to stay a little longer.</p></div>
            <div className="reason-grid">{reasons.map((reason) => <article className="reason" key={reason.title}><span><Icon name={reason.icon} size={26} /></span><h3>{reason.title}</h3><p>{reason.copy}</p></article>)}</div>
          </section>

        </>}

        {page === 'menu' && <section className="menu-section section" aria-label="Bewraped menu">
          {menuSections.map((section) => <div className="menu-group" id={section.id} key={section.id}><div className="section-heading"><div><p className="eyebrow eyebrow--red">{section.eyebrow}</p><h2>{section.title}</h2></div><p>{section.description}</p></div><div className="menu-grid">{section.items.map((item) => <MenuCard item={item} key={item.name} />)}</div></div>)}
        </section>}

        {page === 'contact' && <section className="visit-section contact-page"><div className="visit-section__content"><p className="eyebrow">Say hello</p><h1>Ready when you are.</h1><p>Leave your name, contact number, and email. The Bewraped team will get back to you soon.</p><button className="button button--cream" type="button" onClick={openContactForm}>Get in touch <Icon name="arrow" size={18} /></button></div></section>}

        <section className="subscribe-band" id="subscribe" aria-labelledby="subscribe-title">
          <div className="subscribe-band__image" aria-hidden="true" />
          <div className="subscribe-band__doodles" aria-hidden="true">
            <span className="subscribe-doodle subscribe-doodle--sparkle"><Icon name="sparkle" size={58} /></span>
            <span className="subscribe-doodle subscribe-doodle--coffee"><Icon name="coffeeBean" size={70} /></span>
            <span className="subscribe-doodle subscribe-doodle--matcha"><Icon name="matcha" size={62} /></span>
            <span className="subscribe-doodle subscribe-doodle--waffle"><Icon name="waffle" size={78} /></span>
            <span className="subscribe-doodle subscribe-doodle--ube"><Icon name="ube" size={68} /></span>
          </div>
          <div className="subscribe-band__content">
            <p className="eyebrow">The Bewraped list</p>
            <h2 id="subscribe-title">A little sweetness, straight to your inbox.</h2>
            <p>Be first to hear about new flavours, pop-ups and sweet little perks.</p>
            <SubscribeForm email={subscribeEmail} onChange={updateSubscribeEmail} onSubmit={submitSubscribeForm} status={subscribeStatus} />
            <small>One good email at a time. No spam, ever.</small>
          </div>
        </section>
      </main>

      <button className={`subscribe-jump${subscribeReached ? ' is-up' : ''}`} type="button" onClick={subscribeReached ? goToTop : goToSubscribe} aria-label={subscribeReached ? 'Scroll to top' : 'Scroll to subscribe'}><span>{subscribeReached ? 'Top' : 'Subscribe'}</span><Icon name="arrowDown" size={19} /></button>

      <footer id="contact" className="site-footer"><div className="footer-brand"><a className="footer-brand__link" href="#/home" onClick={goHome}><img className="footer-sticker" src="./images/bewraped-icon-red.png" alt="Bewraped icon" /></a><p>Fresh bubble waffles and small-batch brews, made for your good moments.</p></div><div className="footer-links"><h2>Explore</h2><a href="#/home" onClick={goHome}>Home</a><a href="#/home#about-details" onClick={goToAbout}>About Bewraped</a><a href="#/menu">Menu</a><a href="#/contact">Contact</a></div><div className="footer-connect"><h2>Say hello</h2><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><span>{siteConfig.location}</span></div><div className="footer-socials"><h2>Social media</h2><div className="social-links"><SocialLink icon="instagram" label="Instagram" href={siteConfig.socialLinks.instagram} /><SocialLink icon="tiktok" label="TikTok" href={siteConfig.socialLinks.tiktok} /><SocialLink icon="linkedin" label="LinkedIn" href={siteConfig.socialLinks.linkedin} /><SocialLink icon="whatsapp" label="WhatsApp" href={siteConfig.socialLinks.whatsapp} /></div></div><div className="footer-note">Copyright {new Date().getFullYear()} {siteConfig.brand}. All rights reserved.</div></footer>
      {page === 'home' && welcomeOpen && <WelcomeModal onClose={() => setWelcomeOpen(false)} onSubscribe={openSubscribeFromWelcome} />}
      {contactFormOpen && <ContactModal onClose={closeContactForm} formValues={contactForm} onChange={updateContactForm} onSubmit={submitContactForm} status={contactStatus} />}
    </>
  )
}

export default App

