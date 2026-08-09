import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { categories, heroSlides, menuSections, reasons, siteConfig } from './data/menu'

const HERO_IMAGE = './images/hero-waffles.png'

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
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  }
  return <svg {...shared}>{paths[name]}</svg>
}

function MenuCard({ item }) {
  return (
    <article className="menu-card">
      <div className="menu-card__image">
        <img src={HERO_IMAGE} alt="A Bewraped bubble waffle and cold brew" style={{ objectPosition: item.position }} />
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

const pageNames = new Set(['home', 'about', 'menu', 'contact'])

function getPageFromHash() {
  const page = window.location.hash.replace(/^#\/?/, '').toLowerCase()
  return pageNames.has(page) ? page : 'home'
}

function App() {
  const mainRef = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [page, setPage] = useState(getPageFromHash)
  const [contactFormOpen, setContactFormOpen] = useState(false)
  const [contactStatus, setContactStatus] = useState('idle')
  const [contactForm, setContactForm] = useState({ name: '', contact: '', email: '' })
  const slide = heroSlides[activeSlide]

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 5500)
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
    const updatePage = () => {
      setPage(getPageFromHash())
      setMenuOpen(false)
    }
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  useEffect(() => {
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

      return () => removeListeners.forEach((remove) => remove())
    }, mainRef)

    return () => context.revert()
  }, [page])

  const selectSlide = (index) => setActiveSlide((index + heroSlides.length) % heroSlides.length)
  const closeMenu = () => setMenuOpen(false)
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
      setContactForm({ name: '', contact: '', email: '' })
      setContactStatus('success')
    } catch {
      setContactStatus('error')
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="site-chrome">
        <div className="announcement"><span>{siteConfig.announcement}</span></div>
        <header className="site-header">
          <a className="brand" href="#/home" aria-label="Bewraped home"><img src="./images/bewraped-logo.jpeg" alt="Bewraped" /></a>
          <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
          <nav className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
            <a className={page === 'home' ? 'is-active' : undefined} href="#/home" aria-current={page === 'home' ? 'page' : undefined} onClick={closeMenu}>Home</a>
            <a className={page === 'about' ? 'is-active' : undefined} href="#/about" aria-current={page === 'about' ? 'page' : undefined} onClick={closeMenu}>About</a>
            <a className={page === 'menu' ? 'is-active' : undefined} href="#/menu" aria-current={page === 'menu' ? 'page' : undefined} onClick={closeMenu}>Menu</a>
            <a className={page === 'contact' ? 'is-active' : undefined} href="#/contact" aria-current={page === 'contact' ? 'page' : undefined} onClick={closeMenu}>Contact</a>
            <a className="nav-order" href={siteConfig.orderUrl} onClick={closeMenu}>Order now <Icon name="arrow" size={16} /></a>
          </nav>
        </header>
      </div>

      <main id="main" ref={mainRef}>
        {page === 'home' && <>
          <section className="hero" style={{ '--hero-position': slide.position, backgroundImage: `linear-gradient(90deg, rgba(62, 11, 14, .86) 0%, rgba(99, 16, 19, .62) 42%, rgba(99, 16, 19, .08) 72%), url(${HERO_IMAGE})` }}>
            <div className="hero__content">
              <p className="eyebrow">{slide.eyebrow}</p>
              <h1>{slide.title}</h1>
              <p className="hero__copy">{slide.description}</p>
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

          <section className="visit-section"><div className="visit-section__content"><p className="eyebrow">Your next treat is waiting</p><h2>Ready when you are.</h2><p>Tell us how to reach you and we will get back to you soon.</p><a className="button button--cream" href="#/contact">Get in touch <Icon name="arrow" size={18} /></a></div></section>
        </>}

        {page === 'about' && <>
          <section className="page-intro section"><p className="eyebrow eyebrow--red">About Bewraped</p><h1>Sweet moments, thoughtfully made.</h1><p>Bewraped is all about fresh bubble waffles, small-batch brews, and easy treats made for the people you share them with.</p></section>
          <section className="why section" aria-labelledby="why-title">
            <div className="section-heading section-heading--split"><div><p className="eyebrow eyebrow--red">Why Bewraped?</p><h2 id="why-title">Good mood food, wrapped up right.</h2></div><p>We keep the menu simple: fresh waffle batter, thoughtful toppings, and brews that make you want to stay a little longer.</p></div>
            <div className="reason-grid">{reasons.map((reason) => <article className="reason" key={reason.title}><span><Icon name={reason.icon} size={26} /></span><h3>{reason.title}</h3><p>{reason.copy}</p></article>)}</div>
          </section>
        </>}

        {page === 'menu' && <section className="menu-section section" aria-label="Bewraped menu">
          {menuSections.map((section) => <div className="menu-group" id={section.id} key={section.id}><div className="section-heading"><div><p className="eyebrow eyebrow--red">{section.eyebrow}</p><h2>{section.title}</h2></div><p>{section.description}</p></div><div className="menu-grid">{section.items.map((item) => <MenuCard item={item} key={item.name} />)}</div></div>)}
        </section>}

        {page === 'contact' && <section className="visit-section contact-page"><div className="visit-section__content"><p className="eyebrow">Say hello</p><h1>Ready when you are.</h1><p>Leave your name, contact number, and email. The Bewraped team will get back to you soon.</p><button className="button button--cream" type="button" onClick={openContactForm}>Get in touch <Icon name="arrow" size={18} /></button></div></section>}
      </main>

      <footer id="contact" className="site-footer"><div className="footer-brand"><img src="./images/bewraped-logo.jpeg" alt="Bewraped" /><p>Bubble waffles, Cloud Brew and Cold Brew made for good moments.</p></div><div><h2>Visit or order</h2><a href={siteConfig.orderUrl}>Place an order</a><span>{siteConfig.location}</span></div><div><h2>Say hello</h2><span>{siteConfig.phone}</span><span>{siteConfig.email}</span><span>{siteConfig.instagram}</span></div><div className="footer-note">Copyright {new Date().getFullYear()} {siteConfig.brand}. All rights reserved.</div></footer>
      {contactFormOpen && <ContactModal onClose={closeContactForm} formValues={contactForm} onChange={updateContactForm} onSubmit={submitContactForm} status={contactStatus} />}
    </>
  )
}

export default App

