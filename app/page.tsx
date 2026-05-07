"use client";

import { useCallback, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle,
  Globe,
  PlayCircle,
  Repeat,
  Send,
  Shield,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToId = useCallback((id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="app-shell">
      {/* Nav */}
      <nav className="nav">
        <div className="brand">
          <svg width="42" height="42" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <path d="M50 8 L80 45 L50 82 L20 45 Z" className="kite-fill-1" />
            <path d="M50 8 L80 45 L50 45 Z" className="kite-fill-2" />
            <path d="M50 45 L80 45 L50 82 Z" className="kite-fill-3" />
            <path d="M50 82 L47 95 Q50 88 53 95 Z" className="kite-tail" />
            <circle cx="50" cy="42" r="4" className="kite-dot" />
          </svg>

          <span className="logo-text">
            Kite<span className="logo-accent">Pay</span>
          </span>
        </div>

        <div className="nav-links">
          <button type="button" className="nav-link" onClick={() => scrollToId("features")}>
            Features
          </button>
          <button type="button" className="nav-link" onClick={() => scrollToId("how")}>
            How It Works
          </button>
          <button type="button" className="nav-link" onClick={() => scrollToId("about")}>
            About
          </button>
          <button type="button" className="signin-btn" onClick={() => setIsModalOpen(true)}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-copy">
          <div className="fade-up">
            <span className="mono badge">Payroll Reimagined</span>
          </div>

          <h1 className="fade-up-delay1 hero-title">
            Pay Your Team in <span className="gradient-text">Stablecoins</span>
          </h1>

          <p className="fade-up-delay2 hero-subtitle">
            Companies send payroll in USDC or USDT. Employees choose — keep crypto or cash out to
            their bank at the best market rate.
          </p>

          <div className="fade-up-delay3 hero-actions">
            <button type="button" className="cta-btn">
              Get Started Free
            </button>

            <button type="button" className="demo-btn">
              <PlayCircle className="icon" />
              <span>Watch Demo</span>
            </button>
          </div>

          <div className="fade-up-delay3 tokens">
            <div className="token">
              <div className="token-circle usdc">$</div>
              <span>USDC</span>
            </div>
            <div className="token">
              <div className="token-circle usdt">₮</div>
              <span>USDT</span>
            </div>
          </div>
        </div>

        <div className="hero-visual-wrap">
          <div className="hero-visual float">
            <div className="dashboard-card">
              <div>
                <div className="muted tiny mono">Payment Sent</div>
                <div className="amount">$12,450.00</div>
                <div className="teal small">USDC • Solana</div>
              </div>

              <div className="payment-list">
                <div className="payment-item">
                  <div className="avatar avatar-teal">
                    <User className="icon-sm" />
                  </div>
                  <div className="payment-info">
                    <div className="white small semibold">Sarah M.</div>
                    <div className="muted tiny">→ Bank Account</div>
                  </div>
                  <span className="teal small semibold">$4,200</span>
                </div>

                <div className="payment-item">
                  <div className="avatar avatar-purple">
                    <User className="icon-sm" />
                  </div>
                  <div className="payment-info">
                    <div className="white small semibold">Alex R.</div>
                    <div className="muted tiny">→ Crypto Wallet</div>
                  </div>
                  <span className="purple small semibold">$3,800</span>
                </div>

                <div className="payment-item">
                  <div className="avatar avatar-amber">
                    <User className="icon-sm" />
                  </div>
                  <div className="payment-info">
                    <div className="white small semibold">Jamie L.</div>
                    <div className="muted tiny">→ Bank Account</div>
                  </div>
                  <span className="teal small semibold">$4,450</span>
                </div>
              </div>
            </div>

            <div className="floating-badge">
              <CheckCircle className="icon-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section">
        <div className="section-head">
          <h2 className="section-title">
            Why Teams Choose <span className="gradient-text">KitePay</span>
          </h2>
          <p className="section-subtitle">
            One platform to manage payroll, give employees flexibility, and cut cross-border fees.
          </p>
        </div>

        <div className="grid-3">
          <div className="feature-card">
            <div className="feature-icon teal-bg">
              <Send className="icon-md teal" />
            </div>
            <h3 className="card-title">Instant Payroll</h3>
            <p className="card-text">
              Send USDC or USDT to your entire team in one transaction. Settled in seconds, not
              days.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple-bg">
              <Repeat className="icon-md purple" />
            </div>
            <h3 className="card-title">Employee Choice</h3>
            <p className="card-text">
              Each employee decides — keep stablecoins in their wallet or auto-convert to fiat at
              the best rate.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon amber-bg">
              <Shield className="icon-md amber" />
            </div>
            <h3 className="card-title">Best Market Rate</h3>
            <p className="card-text">
              Aggregated liquidity across DEXs and OTC desks ensures your team always gets the best
              conversion rate.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="section">
        <div className="section-head">
          <h2 className="section-title">How It Works</h2>
        </div>

        <div className="grid-3 how-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="card-title">Company Funds Payroll</h3>
            <p className="card-text">
              Load USDC or USDT into your KitePay account. Set salary amounts for each employee.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="card-title">Employees Choose</h3>
            <p className="card-text">
              Each team member picks — receive in crypto wallet or convert to local currency in
              their bank.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="card-title">Instant Settlement</h3>
            <p className="card-text">
              Payments hit wallets instantly. Bank transfers arrive same day at the best available
              rate.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section">
        <div className="about-grid">
          <div>
            <h2 className="section-title">
              About <span className="gradient-text">KitePay</span>
            </h2>
            <p className="about-text">
              We believe payroll is broken. Companies lose 2-5% to cross-border fees and delays.
              Employees wait days for payment and have no choice in how they receive compensation.
            </p>
            <p className="about-text">
              KitePay changes that. Built by payment engineers and blockchain specialists, we've
              created a payroll system for the global workforce — fast, transparent, and in
              stablecoins.
            </p>

            <div className="about-points">
              <div className="about-point">
                <div className="check-wrap">
                  <Check className="icon-sm teal" />
                </div>
                <div>
                  <h4 className="white semibold">Founded 2023</h4>
                  <p className="muted small">Building the future of global payroll</p>
                </div>
              </div>

              <div className="about-point">
                <div className="check-wrap">
                  <Check className="icon-sm teal" />
                </div>
                <div>
                  <h4 className="white semibold">100+ Companies</h4>
                  <p className="muted small">Trust us with their payroll</p>
                </div>
              </div>

              <div className="about-point">
                <div className="check-wrap">
                  <Check className="icon-sm teal" />
                </div>
                <div>
                  <h4 className="white semibold">Fully Compliant</h4>
                  <p className="muted small">Licensed and regulated in all jurisdictions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stat-row">
              <div className="stat-icon teal-bg">
                <Globe className="icon-md teal" />
              </div>
              <div>
                <p className="muted small">Global Coverage</p>
                <p className="stat-value">180+ Countries</p>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-icon purple-bg">
                <Users className="icon-md purple" />
              </div>
              <div>
                <p className="muted small">Team Members</p>
                <p className="stat-value">50,000+</p>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-icon amber-bg">
                <Zap className="icon-md amber" />
              </div>
              <div>
                <p className="muted small">Transactions Monthly</p>
                <p className="stat-value">$250M+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                  <path d="M50 8 L80 45 L50 82 L20 45 Z" className="kite-fill-1" />
                  <path d="M50 8 L80 45 L50 45 Z" className="kite-fill-2" />
                  <path d="M50 45 L80 45 L50 82 Z" className="kite-fill-3" />
                </svg>
                <span className="footer-brand-text">KitePay</span>
              </div>
              <p className="muted small">Global payroll in stablecoins.</p>
            </div>

            <div>
              <h4 className="footer-head">Product</h4>
              <ul className="footer-links">
                <li>
                  <button type="button" className="footer-link" onClick={() => scrollToId("features")}>
                    Features
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => scrollToId("how")}>
                    How It Works
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => scrollToId("about")}>
                    About
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-head">Company</h4>
              <ul className="footer-links">
                <li>
                  <a href="#" className="footer-link">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-head">Legal</h4>
              <ul className="footer-links">
                <li>
                  <a href="#" className="footer-link">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="muted small">© 2026 KitePay. All rights reserved.</p>

            <div className="socials">
              <a href="#" className="social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" className="icon-sm" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2H21l-6.59 7.51L22 22h-6.842l-5.37-6.92L3.7 22H1l7.05-8.04L2 2h6.996l4.912 6.31L18.244 2Zm-1.2 18h1.72L8.06 3.91H6.22L17.044 20Z" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" className="icon-sm" fill="currentColor" aria-hidden="true">
                  <path d="M6.94 6.5A1.94 1.94 0 1 1 3.06 6.5a1.94 1.94 0 0 1 3.88 0ZM3.5 9h3v12h-3V9Zm5 0h2.88v1.64h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.6V21h-3v-6.06c0-1.45-.03-3.31-2.02-3.31-2.03 0-2.34 1.58-2.34 3.21V21h-3V9Z" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <svg viewBox="0 0 24 24" className="icon-sm" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.38 6.84 9.74.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.18-3.37-1.18-.46-1.2-1.12-1.52-1.12-1.52-.92-.65.07-.64.07-.64 1.02.07 1.56 1.07 1.56 1.07.91 1.58 2.4 1.12 2.98.86.09-.68.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.38-2.03 1.01-2.75-.1-.27-.44-1.37.1-2.86 0 0 .82-.27 2.7 1.05A9.13 9.13 0 0 1 12 6.84c.83 0 1.67.11 2.45.31 1.88-1.32 2.7-1.05 2.7-1.05.54 1.49.2 2.59.1 2.86.63.72 1 1.63 1 2.75 0 3.95-2.34 4.81-4.57 5.07.36.32.68.95.68 1.92v2.85c0 .27.18.59.69.48A10.25 10.25 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Sign In</h2>
              <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X className="icon-sm" />
              </button>
            </div>

            <div className="modal-body">
              <button
                type="button"
                className="signin-option"
                onClick={() => {
                  console.log("Company sign-in clicked");
                  setIsModalOpen(false);
                }}
              >
                <div className="option-icon teal-bg">
                  <Building2 className="icon-sm teal" />
                </div>
                <div className="option-text">
                  <p className="white semibold small">Company</p>
                  <p className="muted tiny">Manage payroll</p>
                </div>
                <ArrowRight className="icon-xs muted" />
              </button>

              <button
                type="button"
                className="signin-option"
                onClick={() => {
                  console.log("Employee sign-in clicked");
                  setIsModalOpen(false);
                }}
              >
                <div className="option-icon purple-bg">
                  <User className="icon-sm purple" />
                </div>
                <div className="option-text">
                  <p className="white semibold small">Employee</p>
                  <p className="muted tiny">View your payments</p>
                </div>
                <ArrowRight className="icon-xs muted" />
              </button>
            </div>

            <div className="modal-footer">
              <p className="muted tiny center">
                Don't have an account? <a href="#" className="link">Sign up free</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}