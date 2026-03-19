const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "https://advisordfy.com";

app.use(express.static(path.join(__dirname, "public")));

// Page definitions with SEO metadata
const pages = {
  "/": {
    title: "Advisor DFY — Booked Meetings for Financial Advisors | Tax & Retirement Leads",
    description: "We book qualified meetings with high-net-worth prospects actively searching for tax planning and retirement income advisors. No shared leads. No cold calling. Just consultations on your calendar.",
    h1: "Booked Meetings For Advisors",
    template: "home",
    schema: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Advisor DFY",
      "description": "Client acquisition system that books qualified meetings for financial advisors specializing in tax planning and retirement income strategies.",
      "url": BASE_URL,
      "serviceType": "Lead Generation for Financial Advisors",
      "areaServed": "US",
      "knowsAbout": ["Financial Advisory", "Tax Planning", "Retirement Planning", "Client Acquisition"]
    }
  },
  "/how-it-works": {
    title: "How It Works — Our Client Acquisition System for Financial Advisors | Advisor DFY",
    description: "Learn how Advisor DFY's search-driven client acquisition system delivers pre-qualified tax and retirement planning prospects directly to your calendar. No cold leads. No guesswork.",
    h1: "How Our System Works",
    template: "how-it-works",
    schema: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How Advisor DFY Books Qualified Meetings",
      "description": "Our 4-step process for delivering pre-qualified financial planning prospects.",
      "step": [
        { "@type": "HowToStep", "name": "Prospect Identification", "text": "We identify individuals actively searching for tax and retirement planning guidance." },
        { "@type": "HowToStep", "name": "Pre-Qualification", "text": "Each prospect is filtered for financial profile, fit, and seriousness." },
        { "@type": "HowToStep", "name": "Booking", "text": "Qualified prospects are booked directly onto your calendar." },
        { "@type": "HowToStep", "name": "Consultation", "text": "You conduct the meeting with a warm, informed prospect." }
      ]
    }
  },
  "/who-we-help": {
    title: "Who We Help — Independent Financial Advisors & RIAs | Advisor DFY",
    description: "Advisor DFY is built for independent financial advisors, RIAs, and consultative practices focused on tax planning and retirement income. See if you're a fit.",
    h1: "Who We Help",
    template: "who-we-help",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Who Advisor DFY Helps",
      "description": "Built for independent financial advisors and RIAs specializing in tax and retirement planning."
    }
  },
  "/faq": {
    title: "FAQ — Common Questions About Advisor DFY's Meeting Booking System",
    description: "Answers to common questions about Advisor DFY: how our intro calls work, contract terms, timeline to results, and how we differ from traditional lead generation.",
    h1: "Frequently Asked Questions",
    template: "faq",
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What happens on the intro call?",
          "acceptedAnswer": { "@type": "Answer", "text": "On the intro call, we walk you through our client acquisition system and how it creates a consistent flow of qualified conversations for advisors like you. No pressure — it's a fit conversation." }
        },
        {
          "@type": "Question",
          "name": "Is there a long-term contract?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. We work on flexible terms because our results speak for themselves. We'll cover specifics on the call." }
        },
        {
          "@type": "Question",
          "name": "How soon can I start seeing results?",
          "acceptedAnswer": { "@type": "Answer", "text": "Most advisors begin seeing booked meetings within the first few weeks of launch. Timelines depend on your niche and market." }
        },
        {
          "@type": "Question",
          "name": "How is this different from traditional lead generation?",
          "acceptedAnswer": { "@type": "Answer", "text": "Traditional lead gen sells you shared, cold contact lists. We deliver pre-qualified individuals who are actively searching for tax and retirement planning help — booked directly onto your calendar." }
        }
      ]
    }
  },
  "/book": {
    title: "Book a Call — See If Advisor DFY Is Right for Your Practice",
    description: "Schedule a no-obligation intro call to learn how Advisor DFY books pre-qualified meetings for financial advisors. Takes 15 minutes.",
    h1: "Book Your Intro Call",
    template: "book",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Book a Call with Advisor DFY"
    }
  }
};

function renderHead(page, path) {
  const canonical = BASE_URL + path;
  return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Advisor DFY">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${page.title}">
    <meta name="twitter:description" content="${page.description}">
    <meta name="robots" content="index, follow">
    <script type="application/ld+json">${JSON.stringify(page.schema)}</script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
  `;
}

function renderNav(currentPath) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/who-we-help", label: "Who We Help" },
    { href: "/faq", label: "FAQ" },
  ];
  return `
  <nav class="site-nav" id="site-nav">
    <div class="nav-inner">
      <a href="/" class="nav-logo" aria-label="Advisor DFY Home">
        <span class="logo-mark">ADVISOR</span><span class="logo-accent">DFY</span>
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-links" id="nav-links">
        ${links.map(l => `<a href="${l.href}" class="${currentPath === l.href ? 'active' : ''}">${l.label}</a>`).join("")}
        <a href="/book" class="nav-cta">Book a Call</a>
      </div>
    </div>
  </nav>`;
}

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <a href="/" class="nav-logo"><span class="logo-mark">ADVISOR</span><span class="logo-accent">DFY</span></a>
        <p class="footer-tagline">Booked meetings for financial advisors who specialize in tax planning and retirement income strategies.</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>Company</h4>
          <a href="/how-it-works">How It Works</a>
          <a href="/who-we-help">Who We Help</a>
          <a href="/faq">FAQ</a>
        </div>
        <div class="footer-col">
          <h4>Get Started</h4>
          <a href="/book">Book an Intro Call</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} Advisor DFY. All rights reserved.</p>
      <div class="footer-legal">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </div>
    </div>
  </footer>`;
}

// Page templates
const templates = {
  home: () => `
    <section class="hero">
      <div class="hero-bg-grid"></div>
      <div class="hero-inner">
        <div class="hero-content">
          <p class="hero-eyebrow">Client Acquisition for Financial Advisors</p>
          <h1 class="hero-headline">Stop Chasing Leads.<br><span class="text-gold">Start Taking Meetings.</span></h1>
          <p class="hero-sub">We put pre-qualified prospects — people actively searching for tax planning and retirement income guidance — directly on your calendar. No cold lists. No shared leads. Just real conversations with serious people.</p>
          <div class="hero-actions">
            <a href="/book" class="btn btn-primary">Book Your Intro Call</a>
            <a href="/how-it-works" class="btn btn-ghost">See How It Works</a>
          </div>
          <div class="hero-proof">
            <div class="proof-item">
              <span class="proof-icon">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L18 6.81l-4 3.9.94 5.5L10 13.63 5.06 16.2 6 10.7 2 6.81l5.61-.97L10 1z" fill="currentColor"/></svg>
              </span>
              <span>Search-driven prospects</span>
            </div>
            <div class="proof-item">
              <span class="proof-icon">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L18 6.81l-4 3.9.94 5.5L10 13.63 5.06 16.2 6 10.7 2 6.81l5.61-.97L10 1z" fill="currentColor"/></svg>
              </span>
              <span>Pre-qualified before booking</span>
            </div>
            <div class="proof-item">
              <span class="proof-icon">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L18 6.81l-4 3.9.94 5.5L10 13.63 5.06 16.2 6 10.7 2 6.81l5.61-.97L10 1z" fill="currentColor"/></svg>
              </span>
              <span>Compliance-aligned messaging</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-card">
            <div class="card-header">
              <span class="card-dot green"></span>
              <span class="card-label">New Meeting Booked</span>
            </div>
            <div class="card-body">
              <div class="card-avatar">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#C8A960" opacity="0.15"/><circle cx="20" cy="16" r="7" fill="#C8A960" opacity="0.4"/><path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#C8A960" opacity="0.25"/></svg>
              </div>
              <div>
                <p class="card-name">Retirement Planning Consultation</p>
                <p class="card-detail">$1.2M investable assets · Age 58</p>
                <p class="card-detail">Interested in Roth conversion strategy</p>
              </div>
            </div>
            <div class="card-time">Tomorrow at 2:00 PM</div>
          </div>
          <div class="hero-card card-offset">
            <div class="card-header">
              <span class="card-dot green"></span>
              <span class="card-label">New Meeting Booked</span>
            </div>
            <div class="card-body">
              <div class="card-avatar">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#C8A960" opacity="0.15"/><circle cx="20" cy="16" r="7" fill="#C8A960" opacity="0.4"/><path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#C8A960" opacity="0.25"/></svg>
              </div>
              <div>
                <p class="card-name">Tax Planning Strategy Session</p>
                <p class="card-detail">Business owner · $850K revenue</p>
                <p class="card-detail">Needs entity structure + tax reduction plan</p>
              </div>
            </div>
            <div class="card-time">Thursday at 10:30 AM</div>
          </div>
        </div>
      </div>
    </section>

    <section class="pain-section" id="pain">
      <div class="section-inner">
        <p class="section-eyebrow">The Problem</p>
        <h2 class="section-heading">Most Lead Gen Is Built for Insurance Agents,<br>Not <span class="text-gold">Fiduciary Advisors</span></h2>
        <div class="pain-grid">
          <div class="pain-card">
            <div class="pain-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M18.36 5.64a9 9 0 11-12.73 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="2" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <h3>Shared, Recycled Leads</h3>
            <p>The same "lead" sold to 5 advisors. By the time you call, they've already talked to your competition — or stopped answering.</p>
          </div>
          <div class="pain-card">
            <div class="pain-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <h3>Unqualified Contacts</h3>
            <p>People who downloaded a free guide aren't prospects. They're curious. You need people with real assets, real timelines, and real urgency.</p>
          </div>
          <div class="pain-card">
            <div class="pain-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M9 3v18" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <h3>Compliance Nightmares</h3>
            <p>Aggressive sales messaging that doesn't align with how a fiduciary advisor actually operates. One bad ad copy away from a compliance issue.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="solution-section">
      <div class="section-inner">
        <p class="section-eyebrow">The Solution</p>
        <h2 class="section-heading">A System That Respects Your Practice<br>— And Fills Your Calendar</h2>
        <div class="solution-grid">
          <div class="solution-step">
            <div class="step-num">01</div>
            <h3>Search-Driven Targeting</h3>
            <p>We reach people at the exact moment they're searching for tax planning help, Roth conversion strategies, or retirement income guidance. Not interruption marketing — intent-based.</p>
          </div>
          <div class="solution-step">
            <div class="step-num">02</div>
            <h3>Pre-Qualification Filtering</h3>
            <p>Every prospect is filtered for investable assets, financial complexity, timeline, and seriousness before they ever touch your calendar. We optimize for fit, not volume.</p>
          </div>
          <div class="solution-step">
            <div class="step-num">03</div>
            <h3>Booked Directly to You</h3>
            <p>No lead lists. No CSV files. Qualified prospects book a consultation directly on your calendar. You show up, they show up, you have a real conversation.</p>
          </div>
          <div class="solution-step">
            <div class="step-num">04</div>
            <h3>Compliance-Aligned Messaging</h3>
            <p>All copy, ads, and landing pages are structured to align with advisory industry standards. Built for fiduciaries, not insurance salespeople.</p>
          </div>
        </div>
        <div class="solution-cta">
          <a href="/book" class="btn btn-primary">See If This Is a Fit</a>
        </div>
      </div>
    </section>

    <section class="numbers-section">
      <div class="section-inner">
        <div class="numbers-grid">
          <div class="number-card">
            <div class="number-val">100%</div>
            <div class="number-label">Exclusive Leads</div>
            <p>Every prospect is yours alone. No shared lists, no competition.</p>
          </div>
          <div class="number-card">
            <div class="number-val">0</div>
            <div class="number-label">Cold Calls Required</div>
            <p>Prospects book with you. You never chase.</p>
          </div>
          <div class="number-card">
            <div class="number-val">Weeks</div>
            <div class="number-label">Not Months to Results</div>
            <p>Most advisors see booked meetings within the first few weeks.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <div class="section-inner">
        <h2 class="section-heading">Ready to See Qualified Prospects<br>on Your Calendar?</h2>
        <p class="final-sub">Book a 15-minute intro call. We'll walk through the system, see if it's a fit for your practice, and answer every question you have. No pressure, no pitch deck — just a conversation.</p>
        <a href="/book" class="btn btn-primary btn-lg">Book Your Intro Call</a>
      </div>
    </section>
  `,

  "how-it-works": () => `
    <section class="page-hero">
      <div class="section-inner">
        <p class="section-eyebrow">How It Works</p>
        <h1 class="page-headline">From Search Query to<br><span class="text-gold">Booked Consultation</span></h1>
        <p class="page-sub">Our system identifies, qualifies, and books prospects who are actively searching for the exact services you offer. Here's the full picture.</p>
      </div>
    </section>

    <section class="process-section">
      <div class="section-inner">
        <div class="process-timeline">
          <div class="process-item">
            <div class="process-marker">
              <div class="process-num">1</div>
              <div class="process-line"></div>
            </div>
            <div class="process-content">
              <h2>Intent-Based Prospect Identification</h2>
              <p>When someone types "how to reduce taxes on retirement income" or "financial advisor for Roth conversions near me" into a search engine — that's intent. That's someone with a real problem, looking for a real solution, right now.</p>
              <p>We position your practice in front of these high-intent searches. No spray-and-pray. No cold audiences. Every impression goes to someone already looking for what you do.</p>
              <div class="process-highlight">
                <strong>Key difference:</strong> Traditional lead gen interrupts people scrolling social media. We meet them at the moment of need.
              </div>
            </div>
          </div>

          <div class="process-item">
            <div class="process-marker">
              <div class="process-num">2</div>
              <div class="process-line"></div>
            </div>
            <div class="process-content">
              <h2>Pre-Qualification & Filtering</h2>
              <p>Not everyone who searches is a fit for your practice. That's why we filter before booking. Prospects go through a structured intake that assesses:</p>
              <div class="check-list">
                <div class="check-item"><span class="check-mark">&#10003;</span> Investable asset range and financial complexity</div>
                <div class="check-item"><span class="check-mark">&#10003;</span> Specific planning needs (tax, retirement income, estate)</div>
                <div class="check-item"><span class="check-mark">&#10003;</span> Timeline and urgency of their situation</div>
                <div class="check-item"><span class="check-mark">&#10003;</span> Seriousness and readiness for a consultation</div>
              </div>
              <p>If they don't meet the bar, they don't get on your calendar. Simple.</p>
            </div>
          </div>

          <div class="process-item">
            <div class="process-marker">
              <div class="process-num">3</div>
              <div class="process-line"></div>
            </div>
            <div class="process-content">
              <h2>Direct Calendar Booking</h2>
              <p>Qualified prospects book a consultation directly onto your schedule. No lead list to download. No phone tag. No "following up" on a cold name.</p>
              <p>When the meeting happens, the prospect already understands what the call is about, has self-identified their planning need, and has committed time to speak with you.</p>
              <div class="process-highlight">
                <strong>Your time is protected:</strong> We optimize for quality consultations, not a high count of low-quality calls.
              </div>
            </div>
          </div>

          <div class="process-item">
            <div class="process-marker">
              <div class="process-num">4</div>
              <div class="process-line"></div>
            </div>
            <div class="process-content">
              <h2>Compliance-First Messaging</h2>
              <p>Every piece of copy — from search ads to landing pages to booking confirmations — is structured to align with advisory industry standards. No misleading claims. No performance guarantees. No bait-and-switch.</p>
              <p>You can hand this to your compliance department and feel good about it. This system was built for fiduciary advisors, and it shows.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <div class="section-inner">
        <h2 class="section-heading">See the System in Action</h2>
        <p class="final-sub">Book a 15-minute intro call. We'll walk you through exactly how the system works for your niche, your market, and your practice.</p>
        <a href="/book" class="btn btn-primary btn-lg">Book Your Intro Call</a>
      </div>
    </section>
  `,

  "who-we-help": () => `
    <section class="page-hero">
      <div class="section-inner">
        <p class="section-eyebrow">Who We Help</p>
        <h1 class="page-headline">Built for Advisors Who Take<br><span class="text-gold">Their Practice Seriously</span></h1>
        <p class="page-sub">This isn't for everyone. It's for a specific kind of advisor — and that's by design.</p>
      </div>
    </section>

    <section class="audience-section">
      <div class="section-inner">
        <h2 class="section-heading">This Is a Fit If You're…</h2>
        <div class="audience-grid">
          <div class="audience-card fit">
            <div class="audience-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3>An Independent Advisor or RIA</h3>
            <p>You have full control over your marketing, your brand, and your client acquisition strategy. You make your own decisions on how to grow — and you're looking for a partner, not a vendor.</p>
          </div>
          <div class="audience-card fit">
            <div class="audience-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3>Focused on Tax Planning & Retirement Income</h3>
            <p>Your specialty is helping clients navigate Roth conversions, tax-efficient withdrawal strategies, Social Security optimization, or complex tax situations. You speak the language — and so do we.</p>
          </div>
          <div class="audience-card fit">
            <div class="audience-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3>Consultative, Not Transactional</h3>
            <p>Your first meeting is a real conversation — understanding the client's full picture, not pitching a product. You close through trust, expertise, and fit — not pressure.</p>
          </div>
          <div class="audience-card fit">
            <div class="audience-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3>Valuing Fit Over Volume</h3>
            <p>You'd rather have 5 conversations a week with the right people than 20 with the wrong ones. You understand that one ideal client can be worth more than a hundred tire-kickers.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="not-for-section">
      <div class="section-inner">
        <h2 class="section-heading">This Is <em>Not</em> a Fit If You're…</h2>
        <div class="audience-grid">
          <div class="audience-card not-fit">
            <div class="audience-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            </div>
            <h3>Looking for Cheap or Shared Leads</h3>
            <p>If you want a list of names for $10 each that 4 other advisors also got, this isn't it. We don't sell leads — we book exclusive, qualified meetings.</p>
          </div>
          <div class="audience-card not-fit">
            <div class="audience-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            </div>
            <h3>A Captive Agent Without Marketing Control</h3>
            <p>If your firm controls your marketing, your messaging, and your brand — there's not enough room for us to operate. You need autonomy for this to work.</p>
          </div>
          <div class="audience-card not-fit">
            <div class="audience-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            </div>
            <h3>Operating With a Short-Term Mindset</h3>
            <p>Building a reliable client acquisition engine takes consistency. If you're looking for a silver bullet or instant results without commitment, we're not the right fit.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <div class="section-inner">
        <h2 class="section-heading">Sound Like You?</h2>
        <p class="final-sub">Let's talk. Book a quick call and we'll determine together if this is the right move for your practice.</p>
        <a href="/book" class="btn btn-primary btn-lg">Book Your Intro Call</a>
      </div>
    </section>
  `,

  faq: () => `
    <section class="page-hero">
      <div class="section-inner">
        <p class="section-eyebrow">FAQ</p>
        <h1 class="page-headline">Questions We Hear<br><span class="text-gold">From Advisors Like You</span></h1>
      </div>
    </section>

    <section class="faq-section">
      <div class="section-inner section-narrow">
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>What happens on the intro call?</span>
            <svg class="faq-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="faq-answer">
            <p>It's a 15-minute conversation where we walk through our client acquisition system and figure out if it makes sense for your practice. We'll ask about your specialty, your ideal client, and your current pipeline. You'll ask us whatever you want. No pressure, no pitch deck — just a fit conversation.</p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>Is there a long-term contract?</span>
            <svg class="faq-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="faq-answer">
            <p>No. We work on flexible terms because the system speaks for itself. Advisors stay because it works, not because they're locked in. We'll cover the specifics on the call.</p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>How soon can I start seeing results?</span>
            <svg class="faq-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="faq-answer">
            <p>Most advisors start seeing booked meetings within the first few weeks of launch. The exact timeline depends on your niche, market, and specifics of your practice — which is something we'll assess together on the intro call.</p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>How is this different from buying leads?</span>
            <svg class="faq-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="faq-answer">
            <p>Night and day. Traditional lead gen gives you a list of names — often shared with multiple advisors — that you then have to cold call and nurture. Most never pick up. We deliver people who are actively searching for your exact services, pre-qualified for fit, and booked directly onto your calendar. You're not chasing — you're consulting.</p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>What kind of prospects will I be meeting with?</span>
            <svg class="faq-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="faq-answer">
            <p>Individuals and couples who are actively looking for help with tax planning, retirement income strategies, Roth conversions, and related financial planning needs. They've self-identified their problem, passed through a qualification filter, and booked time with you. These are real conversations, not cold introductions.</p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>Will the messaging be compliant with my firm's standards?</span>
            <svg class="faq-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="faq-answer">
            <p>All messaging is structured to align with advisory industry standards — no performance guarantees, no misleading claims, no aggressive sales tactics. We built this for fiduciary advisors. That said, we always recommend you run final materials by your compliance team, and we're happy to work with them.</p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>Do I need to run my own ads or build landing pages?</span>
            <svg class="faq-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="faq-answer">
            <p>No. We handle the full system — targeting, ad copy, landing pages, qualification, and booking. You focus on what you're best at: advising clients.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <div class="section-inner">
        <h2 class="section-heading">Still Have Questions?</h2>
        <p class="final-sub">The best way to get answers is to talk to us. Book a quick call — we'll cover anything that's on your mind.</p>
        <a href="/book" class="btn btn-primary btn-lg">Book Your Intro Call</a>
      </div>
    </section>
  `,

  book: () => `
    <section class="page-hero">
      <div class="section-inner">
        <p class="section-eyebrow">Get Started</p>
        <h1 class="page-headline">Let's See If This Is<br><span class="text-gold">Right for You</span></h1>
        <p class="page-sub">Book a 15-minute intro call. No pitch, no pressure. We'll walk through the system, learn about your practice, and figure out together if this makes sense.</p>
      </div>
    </section>

    <section class="book-section">
      <div class="section-inner">
        <div class="book-grid">
          <div class="book-info">
            <h2>What to Expect</h2>
            <div class="expect-list">
              <div class="expect-item">
                <div class="expect-num">1</div>
                <div>
                  <h3>Quick Practice Overview</h3>
                  <p>We'll ask about your specialty, your ideal client, and what your pipeline looks like today.</p>
                </div>
              </div>
              <div class="expect-item">
                <div class="expect-num">2</div>
                <div>
                  <h3>System Walkthrough</h3>
                  <p>We'll show you exactly how the client acquisition system works and what kind of prospects it delivers.</p>
                </div>
              </div>
              <div class="expect-item">
                <div class="expect-num">3</div>
                <div>
                  <h3>Fit Assessment</h3>
                  <p>We'll determine together if this is the right move for your practice. If it's not, we'll tell you — and point you in a better direction.</p>
                </div>
              </div>
            </div>
            <div class="book-guarantee">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <p><strong>No pitch, no pressure.</strong> If we're not a fit, we'll be the first to tell you.</p>
            </div>
          </div>
          <div class="book-embed">
            <div class="calendar-placeholder">
              <p>[ Embed your Calendly, HubSpot, or booking widget here ]</p>
              <p class="calendar-hint">Replace this div with your scheduling embed code.</p>
              <!-- 
                Example Calendly embed:
                <div class="calendly-inline-widget" data-url="https://calendly.com/your-link" style="min-width:320px;height:630px;"></div>
                <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
              -->
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  // Minimal legal pages for credibility
  privacy: () => `
    <section class="page-hero">
      <div class="section-inner">
        <h1 class="page-headline">Privacy Policy</h1>
      </div>
    </section>
    <section class="legal-section">
      <div class="section-inner section-narrow">
        <p><em>Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>
        <h2>Information We Collect</h2>
        <p>When you visit our website or book a call, we may collect your name, email address, phone number, and information about your financial advisory practice that you voluntarily provide.</p>
        <h2>How We Use Your Information</h2>
        <p>We use the information you provide to schedule consultations, communicate with you about our services, and improve our website. We do not sell your personal information to third parties.</p>
        <h2>Cookies</h2>
        <p>Our site may use cookies and similar tracking technologies to analyze site traffic and improve your browsing experience. You can control cookie settings through your browser.</p>
        <h2>Contact</h2>
        <p>If you have questions about this policy, please contact us through our booking page.</p>
      </div>
    </section>
  `,

  terms: () => `
    <section class="page-hero">
      <div class="section-inner">
        <h1 class="page-headline">Terms of Service</h1>
      </div>
    </section>
    <section class="legal-section">
      <div class="section-inner section-narrow">
        <p><em>Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>
        <h2>Use of This Website</h2>
        <p>This website is provided for informational purposes about Advisor DFY's client acquisition services. By accessing this site, you agree to these terms.</p>
        <h2>No Financial Advice</h2>
        <p>Advisor DFY is a marketing services company. Nothing on this website constitutes financial, investment, tax, or legal advice. We provide client acquisition services for licensed financial advisors.</p>
        <h2>Disclaimers</h2>
        <p>Results described on this website are not guaranteed. Individual results will vary based on market conditions, practice specifics, and other factors.</p>
        <h2>Contact</h2>
        <p>Questions about these terms may be directed to us through our booking page.</p>
      </div>
    </section>
  `
};

// Add legal pages to routing
pages["/privacy"] = {
  title: "Privacy Policy — Advisor DFY",
  description: "Read the Advisor DFY privacy policy.",
  template: "privacy",
  schema: { "@context": "https://schema.org", "@type": "WebPage", "name": "Privacy Policy" }
};
pages["/terms"] = {
  title: "Terms of Service — Advisor DFY",
  description: "Read the Advisor DFY terms of service.",
  template: "terms",
  schema: { "@context": "https://schema.org", "@type": "WebPage", "name": "Terms of Service" }
};

// Route handler
function renderPage(pagePath) {
  const page = pages[pagePath];
  if (!page) return null;
  const template = templates[page.template];
  if (!template) return null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead(page, pagePath)}
</head>
<body>
  ${renderNav(pagePath)}
  <main>
    ${template()}
  </main>
  ${renderFooter()}
  <script src="/js/main.js"></script>
</body>
</html>`;
}

// Register routes
Object.keys(pages).forEach(path => {
  app.get(path, (req, res) => {
    const html = renderPage(path);
    if (html) {
      res.send(html);
    } else {
      res.status(404).send("Not found");
    }
  });
});

// Sitemap
app.get("/sitemap.xml", (req, res) => {
  res.set("Content-Type", "application/xml");
  const urls = Object.keys(pages).map(p => `  <url><loc>${BASE_URL}${p}</loc><changefreq>${p === "/" ? "weekly" : "monthly"}</changefreq><priority>${p === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
});

// Robots.txt
app.get("/robots.txt", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send(`User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml`);
});

// 404
app.use((req, res) => {
  res.status(404).send(renderPage("/") || "Not found");
});

app.listen(PORT, () => console.log(`Advisor DFY running on port ${PORT}`));
