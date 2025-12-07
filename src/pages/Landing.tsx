import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Floating Gradient Orbs */}
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="#" className="brand">
            <div className="brand-mark">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                {/* Stylized syringe/injection icon */}
                <path d="M19.5 4.5L18 6M18 6L15 3M18 6L12 12M12 12L6 18L3 21L6 18L12 12Z" stroke="#010003" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9L9 15" stroke="#010003" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="18" cy="6" r="2" fill="#010003"/>
              </svg>
            </div>
            <span className="brand-text"><span>PRO</span>TOCOL</span>
          </a>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#tracking">Tracking</a>
            <a href="#clinics">For Clinics</a>
            <a href="#faq">FAQ</a>
            <button onClick={() => navigate('/auth')} className="btn btn-primary">Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">Free TRT Dose Tracker</div>
            <h1>Track. Log. Optimize.</h1>
            <p>The precision tool for managing your TRT protocol. Track doses, monitor biomarkers, and unlock DPD Intelligence™ — the hidden dimension of your labs that changes everything.</p>
            <div className="hero-cta">
              <button onClick={() => navigate('/auth')} className="btn btn-primary btn-large">Start Tracking — It's Free</button>
              <a href="#features" className="btn btn-secondary">See Features →</a>
            </div>
            <div className="hero-trust">
              <Check className="w-4 h-4 fill-[var(--accent)]" />
              No account required • Works offline • Your data stays on your device
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">100%</div>
                <div className="hero-stat-label">Privacy First</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">DPD™</div>
                <div className="hero-stat-label">Intelligence</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">PWA</div>
                <div className="hero-stat-label">Install Anywhere</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="phone-notch"></div>
                <div className="phone-content">
                  <div className="app-header">
                    <div className="app-title"><span>Pro</span>tocol</div>
                    <div className="app-subtitle">Track · Log · Optimize</div>
                  </div>
                  <div className="app-card">
                    <div className="app-card-header">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[var(--accent)]"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"/></svg>
                      Today's Dose
                    </div>
                    <button className="dose-btn">
                      <Check className="w-4 h-4" />
                      Confirm Dose Taken
                    </button>
                    <div className="dose-info">Last dose: Wed • 0.25 • Ventrogluteal</div>
                    <div className="mini-stats">
                      <div className="mini-stat"><div className="mini-stat-label">Next Dose</div><div className="mini-stat-value">Sat, Dec 6</div></div>
                      <div className="mini-stat"><div className="mini-stat-label">Dose Time</div><div className="mini-stat-value">09:00 AM</div></div>
                    </div>
                  </div>
                  <div className="app-card">
                    <div className="app-card-header">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[var(--accent)]"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                      Biomarker Tracking
                    </div>
                    <div className="chart-placeholder">
                      <div className="chart-line">
                        <svg viewBox="0 0 200 50" preserveAspectRatio="none">
                          <defs><linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{stopColor:'#26e5a4',stopOpacity:0.3}}/><stop offset="100%" style={{stopColor:'#26e5a4',stopOpacity:0}}/></linearGradient></defs>
                          <path d="M0,35 Q30,40 50,25 T100,30 T150,15 T200,20" stroke="#26e5a4" strokeWidth="2" fill="none"/>
                          <path d="M0,35 Q30,40 50,25 T100,30 T150,15 T200,20 V50 H0 Z" fill="url(#chartGrad)"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="social-proof">
        <div className="social-proof-inner">
          <div className="social-proof-stats">
            <div className="proof-stat"><div className="proof-stat-value">2,500+</div><div className="proof-stat-label">Active Users</div></div>
            <div className="proof-stat"><div className="proof-stat-value">50K+</div><div className="proof-stat-label">Doses Tracked</div></div>
            <div className="proof-stat"><div className="proof-stat-value">4.9★</div><div className="proof-stat-label">User Rating</div></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">How It Works</div>
            <h2 className="section-title">Start Tracking in 30 Seconds</h2>
            <p className="section-desc">No signup required. Install the app and start logging immediately.</p>
          </div>
          <div className="steps">
            <div className="step"><div className="step-number">1</div><h3>Install the App</h3><p>Add Protocol to your home screen. Works on any device — iPhone, Android, or desktop.</p></div>
            <div className="step"><div className="step-number">2</div><h3>Set Your Protocol</h3><p>Enter your dosing schedule — weekly, every 3.5 days, or custom intervals. We handle the rest.</p></div>
            <div className="step"><div className="step-number">3</div><h3>Track & Optimize</h3><p>Log doses with one tap, add lab results, and watch your data come to life with DPD insights.</p></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Features</div>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-desc">Built for precision tracking with privacy at the core. No accounts required, your data stays on your device.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent)] fill-none stroke-2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
              <h3>One-Tap Dose Logging</h3>
              <p>Confirm your dose in seconds. Track amounts, injection sites, and timing with smart rotation reminders.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent)] fill-none stroke-2"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg></div>
              <h3>Flexible Protocols</h3>
              <p>Weekly or interval-based dosing. Support for any protocol — cypionate, enanthate, or complex multi-compound stacks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent)] fill-none stroke-2"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg></div>
              <h3>Biomarker Charts</h3>
              <p>Visualize testosterone, hematocrit, and other labs over time. Reference ranges included for quick assessment.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent)] fill-none stroke-2"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg></div>
              <h3>Smart Reminders</h3>
              <p>Never miss a dose. Get notified before injection days and lab appointments with customizable lead times.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent)] fill-none stroke-2"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/></svg></div>
              <h3>Lab Prep Assistant</h3>
              <p>Prepare for accurate labs with hydration reminders, timing guidance, and smart alerts to avoid dosing too close to your draw.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent)] fill-none stroke-2"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg></div>
              <h3>Privacy First</h3>
              <p>No accounts, no cloud sync. All data stored locally on your device. Export anytime for your records.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent)] fill-none stroke-2"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg></div>
              <h3>PWA Ready</h3>
              <p>Install on any device — iOS, Android, or desktop. Works offline with full functionality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Pricing</div>
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-desc">Start free forever. Upgrade when you need advanced insights.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-tier">Starter</div>
              <div className="pricing-name">Free</div>
              <div className="pricing-price"><span className="currency">$</span><span className="amount">0</span><span className="period">/forever</span></div>
              <div className="pricing-annual"></div>
              <p className="pricing-desc">Perfect for getting started with basic protocol tracking.</p>
              <ul className="pricing-features">
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> One-tap dose logging</li>
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> 90-day dose history</li>
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> 3 biomarkers tracked</li>
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> Basic reminders</li>
                <li className="disabled"><X className="w-[18px] h-[18px] stroke-[var(--text-softer)] stroke-[2.5]" /> DPD Intelligence™</li>
              </ul>
              <button onClick={() => navigate('/auth')} className="btn btn-secondary">Get Started Free</button>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-tier">Pro</div>
              <div className="pricing-name">Protocol+</div>
              <div className="pricing-price"><span className="currency">$</span><span className="amount">7</span><span className="period">/month</span></div>
              <div className="pricing-annual">or <span>$59/year</span> (save 30%)</div>
              <p className="pricing-desc">Full power for serious protocol optimization.</p>
              <ul className="pricing-features">
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> Everything in Free</li>
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> <strong>Unlimited history</strong></li>
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> <strong>DPD Intelligence™</strong></li>
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> Unlimited biomarkers</li>
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> PDF exports for doctors</li>
              </ul>
              <button onClick={() => navigate('/auth')} className="btn btn-primary">Start Free Trial</button>
            </div>
            <div className="pricing-card">
              <div className="pricing-tier">Clinic Patient</div>
              <div className="pricing-name">Partner</div>
              <div className="pricing-price"><span className="currency">$</span><span className="amount">4</span><span className="period">/month</span></div>
              <div className="pricing-annual"><span>50% off</span> first 3 months via clinic</div>
              <p className="pricing-desc">Exclusive rate for partner clinic patients.</p>
              <ul className="pricing-features">
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> Everything in Pro</li>
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> <strong>$3.50/mo first 3 months</strong></li>
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> Ongoing 40% discount</li>
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> Share reports with clinic</li>
                <li><Check className="w-[18px] h-[18px] stroke-[var(--accent)] stroke-[2.5]" /> Priority support</li>
              </ul>
              <a href="#clinics" className="btn btn-secondary">Ask Your Clinic →</a>
            </div>
          </div>
        </div>
      </section>

      {/* DPD Section */}
      <section className="dpd-section" id="tracking">
        <div className="section-inner">
          <div className="dpd-inner">
            <div className="dpd-visual">
              <div className="dpd-chart-header">
                <span style={{fontSize: '14px', fontWeight: 600}}>Your Labs — Transformed</span>
                <div className="dpd-toggle">
                  <button className="dpd-toggle-btn">Standard View</button>
                  <button className="dpd-toggle-btn active">🔓 Unlock Pattern</button>
                </div>
              </div>
              <div className="dpd-chart-container" style={{position: 'relative'}}>
                <div className="dpd-chart" style={{filter: 'blur(3px)', opacity: 0.6}}>
                  <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                    <defs><linearGradient id="bandGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{stopColor:'#26e5a4',stopOpacity:0.25}}/><stop offset="100%" style={{stopColor:'#26e5a4',stopOpacity:0.05}}/></linearGradient></defs>
                    <path d="M50,30 L130,45 L210,75 L290,95 L370,85 L370,115 L290,135 L210,105 L130,75 L50,50 Z" fill="url(#bandGradient)" stroke="none"/>
                    <path d="M50,40 Q90,50 130,60 T210,90 T290,115 T370,100" stroke="#26e5a4" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="50" cy="40" r="6" fill="#26e5a4"/><circle cx="130" cy="60" r="6" fill="#26e5a4"/><circle cx="210" cy="90" r="6" fill="#26e5a4"/><circle cx="290" cy="115" r="6" fill="#26e5a4"/><circle cx="370" cy="100" r="6" fill="#26e5a4"/>
                  </svg>
                </div>
                <div className="dpd-overlay">
                  <div style={{fontSize: '32px', marginBottom: '8px'}}>🔒</div>
                  <div style={{fontSize: '14px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px'}}>Hidden Dimension</div>
                  <div style={{fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '200px'}}>The insight your doctor doesn't have access to</div>
                </div>
              </div>
              <div className="dpd-legend" style={{justifyContent: 'center', opacity: 0.5}}>
                <div className="dpd-legend-item"><div className="dpd-legend-dot" style={{background: '#26e5a4'}}></div> Pattern Revealed</div>
                <div className="dpd-legend-item"><div className="dpd-legend-line" style={{background: 'linear-gradient(90deg, rgba(38,229,164,0.4), rgba(38,229,164,0.1))'}}></div> Variance Analysis</div>
              </div>
            </div>
            <div className="dpd-content">
              <h2><span>DPD</span> Intelligence™</h2>
              <p>Your labs have been lying to you. A testosterone reading of 650 ng/dL means nothing without <em>one critical piece of context</em> that most people — including many doctors — overlook entirely.</p>
              <p style={{color: 'var(--accent)', fontWeight: 500, marginBottom: '24px'}}>Protocol users have discovered a hidden pattern in their data that changes everything.</p>
              <ul className="dpd-benefits">
                <li><Check className="w-5 h-5 stroke-[var(--accent)] stroke-2" /><span><strong>See the invisible</strong> — A dimension of your bloodwork that standard lab views completely miss</span></li>
                <li><Check className="w-5 h-5 stroke-[var(--accent)] stroke-2" /><span><strong>End the confusion</strong> — Finally understand why your numbers seem "all over the place"</span></li>
                <li><Check className="w-5 h-5 stroke-[var(--accent)] stroke-2" /><span><strong>Unlock your true baseline</strong> — Know your real hormonal fingerprint, not random snapshots</span></li>
              </ul>
              <button onClick={() => navigate('/auth')} className="btn btn-primary" style={{marginTop: '16px'}}>Unlock DPD Intelligence™ →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Partners */}
      <section className="clinic-partners" id="clinics">
        <div className="section-inner">
          <div className="clinic-inner">
            <div className="clinic-content">
              <div className="section-tag">For Clinics</div>
              <h2><span>Partner</span> with Protocol</h2>
              <p>Give your patients a competitive advantage. Protocol partner clinics offer exclusive pricing and seamless integration with your practice.</p>
              <ul className="clinic-benefits">
                <li><svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent)] fill-none stroke-2"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg><span><strong>Better patient outcomes</strong> — Structured tracking leads to better protocol adherence</span></li>
                <li><svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent)] fill-none stroke-2"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg><span><strong>DPD-normalized reports</strong> — Receive patient data organized by days post dose</span></li>
                <li><svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--accent)] fill-none stroke-2"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg><span><strong>HIPAA-ready architecture</strong> — Data stays on patient devices; optional encrypted sharing</span></li>
              </ul>
              <a href="mailto:clinics@multifactorsolutions.com" className="btn btn-primary">Apply for Clinic Partnership</a>
            </div>
            <div className="clinic-visual">
              <div className="clinic-offer-badge">Exclusive Offer</div>
              <div className="clinic-discount-label">Patient Discount</div>
              <div className="clinic-discount">50%</div>
              <div className="clinic-discount-desc">off Protocol+ for first 3 months</div>
              <div className="clinic-details">
                <div className="clinic-details-item"><span className="clinic-details-label">First 3 Months</span><span className="clinic-details-value">$3.50/mo (was $7)</span></div>
                <div className="clinic-details-item"><span className="clinic-details-label">Ongoing Rate</span><span className="clinic-details-value">$4.20/mo (40% off)</span></div>
                <div className="clinic-details-item"><span className="clinic-details-label">Annual Option</span><span className="clinic-details-value">$35/yr (50% off)</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Testimonials</div>
            <h2 className="section-title">What Users Are Saying</h2>
            <p className="section-desc">Join thousands of users who've optimized their protocols with Protocol.</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[1,2,3,4,5].map(i => <svg key={i} viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-[var(--accent)]"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
              </div>
              <p className="testimonial-text">"The DPD feature is a game-changer. I finally understand why my labs were all over the place — I was drawing at different points in my cycle. Now I can actually compare apples to apples."</p>
              <div className="testimonial-author"><div className="testimonial-avatar">M</div><div className="testimonial-info"><div className="testimonial-name">Mike R.</div><div className="testimonial-detail">3.5 day protocol • 8 months</div></div></div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[1,2,3,4,5].map(i => <svg key={i} viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-[var(--accent)]"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
              </div>
              <p className="testimonial-text">"Simple, clean, does exactly what it needs to. No bloat, no account required, no data leaving my phone. This is how all health apps should be built."</p>
              <div className="testimonial-author"><div className="testimonial-avatar">J</div><div className="testimonial-info"><div className="testimonial-name">Jason T.</div><div className="testimonial-detail">Weekly protocol • 2 years</div></div></div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[1,2,3,4,5].map(i => <svg key={i} viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-[var(--accent)]"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
              </div>
              <p className="testimonial-text">"My doctor was impressed when I showed up with my DPD-normalized charts. Made our conversation about adjusting my dose so much more productive."</p>
              <div className="testimonial-author"><div className="testimonial-avatar">D</div><div className="testimonial-info"><div className="testimonial-name">David K.</div><div className="testimonial-detail">EOD protocol • 1 year</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Themes */}
      <section className="themes" id="themes">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Personalize</div>
            <h2 className="section-title">Multiple Themes</h2>
            <p className="section-desc">Choose the aesthetic that fits your style. Dark mode optimized for all themes.</p>
          </div>
          <div className="themes-showcase">
            <div className="theme-preview default"><div className="theme-header"><div className="theme-name"><span>Pro</span>tocol</div></div><div className="theme-body"><div className="theme-card"><div className="theme-card-label">TODAY'S DOSE</div><button className="theme-btn">✓ Confirm Dose</button></div></div></div>
            <div className="theme-preview light"><div className="theme-header"><div className="theme-name"><span>Pro</span>tocol</div></div><div className="theme-body"><div className="theme-card"><div className="theme-card-label">TODAY'S DOSE</div><button className="theme-btn">✓ Confirm Dose</button></div></div></div>
            <div className="theme-preview gold"><div className="theme-header"><div className="theme-name"><span>Pro</span>tocol</div></div><div className="theme-body"><div className="theme-card"><div className="theme-card-label">TODAY'S DOSE</div><button className="theme-btn">✓ Confirm Dose</button></div></div></div>
            <div className="theme-preview felix"><span className="premium-label">Pro</span><div className="theme-header"><div className="theme-name"><span>Pro</span>tocol</div></div><div className="theme-body"><div className="theme-card"><div className="theme-card-label" style={{color: '#00f0ff', fontFamily: 'monospace'}}>NEXT DOSE</div><button className="theme-btn">✓ Confirm</button></div></div></div>
            <div className="theme-preview retro"><span className="premium-label">Pro</span><div className="theme-header"><div className="theme-name"><span>Pro</span>tocol</div></div><div className="theme-body"><div className="theme-card"><div className="theme-card-label" style={{color: '#5a6a50', fontFamily: 'monospace', fontWeight: 700}}>TODAY'S DOSE</div><button className="theme-btn">► START</button></div></div></div>
            <div className="theme-preview noir"><span className="premium-label">Pro</span><div className="theme-header"><div className="theme-name"><span>Pro</span>tocol</div></div><div className="theme-body"><div className="theme-card"><div className="theme-card-label" style={{color: '#666', letterSpacing: '0.1em'}}>TODAY'S DOSE</div><button className="theme-btn">✓ Confirm Dose</button></div></div></div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="roadmap" id="roadmap">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Roadmap</div>
            <h2 className="section-title">What's Coming</h2>
            <p className="section-desc">We're constantly improving Protocol based on user feedback. Here's what's on the horizon.</p>
          </div>
          <div className="roadmap-grid">
            <div className="roadmap-item completed">
              <div className="roadmap-status"><Check className="w-5 h-5 fill-[var(--accent)]" /></div>
              <div className="roadmap-content">
                <h4>DPD Intelligence™</h4>
                <p>Normalize your labs by days post dose for accurate protocol comparison</p>
              </div>
            </div>
            <div className="roadmap-item completed">
              <div className="roadmap-status"><Check className="w-5 h-5 fill-[var(--accent)]" /></div>
              <div className="roadmap-content">
                <h4>Lab Prep Assistant</h4>
                <p>Hydration reminders, 48-hour dose warnings, and smart lab scheduling</p>
              </div>
            </div>
            <div className="roadmap-item in-progress">
              <div className="roadmap-status"><div className="roadmap-progress-dot"></div></div>
              <div className="roadmap-content">
                <h4>Injection Guide &amp; Assistant</h4>
                <p>Step-by-step injection guidance, technique tips, and site rotation optimization</p>
                <span className="roadmap-eta">Coming Q1 2025</span>
              </div>
            </div>
            <div className="roadmap-item planned">
              <div className="roadmap-status"><div className="roadmap-planned-dot"></div></div>
              <div className="roadmap-content">
                <h4>AI Protocol Insights</h4>
                <p>Personalized optimization suggestions based on your tracking data</p>
                <span className="roadmap-eta">Planned</span>
              </div>
            </div>
            <div className="roadmap-item planned">
              <div className="roadmap-status"><div className="roadmap-planned-dot"></div></div>
              <div className="roadmap-content">
                <h4>Clinic Dashboard</h4>
                <p>Secure patient data sharing with your TRT clinic</p>
                <span className="roadmap-eta">Planned</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">FAQ</div>
            <h2 className="section-title">Common Questions</h2>
          </div>
          <div className="faq-grid">
            <div className="faq-item"><div className="faq-question">Is there a free version?</div><div className="faq-answer">Yes! The free tier includes one-tap dose logging, 90 days of history, and 3 biomarker slots. It's fully functional for basic tracking needs.</div></div>
            <div className="faq-item"><div className="faq-question">Where is my data stored?</div><div className="faq-answer">100% on your device. We never see your data, never collect it, never sell it. You can export it anytime.</div></div>
            <div className="faq-item"><div className="faq-question">What is DPD Intelligence™?</div><div className="faq-answer">Your secret weapon. DPD (Days Post Dose) reveals the hidden pattern in your labs by syncing every result to your injection cycle. Finally see what your numbers actually mean — not just what day you happened to draw.</div></div>
            <div className="faq-item"><div className="faq-question">Does it work offline?</div><div className="faq-answer">Yes! Protocol is a PWA (Progressive Web App) that works fully offline. Your data syncs locally and is always accessible.</div></div>
            <div className="faq-item"><div className="faq-question">How do clinic discounts work?</div><div className="faq-answer">If your clinic is a Protocol partner, you get 50% off for 3 months, then 40% off ongoing. Ask your clinic if they're enrolled.</div></div>
            <div className="faq-item"><div className="faq-question">How do I install on iPhone?</div><div className="faq-answer">Open in Safari, tap the Share button, then "Add to Home Screen." That's it — full app experience, no App Store needed.</div></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="section-inner">
          <div className="cta-inner">
            <h2>Start Tracking Today</h2>
            <p>Your protocol deserves precision tracking. Join thousands of users who've taken control of their TRT journey.</p>
            <button onClick={() => navigate('/auth')} className="btn btn-primary btn-large">Get Protocol — It's Free</button>
            <div className="cta-features">
              <span><Check className="w-4 h-4 stroke-[var(--accent)] stroke-2" /> No signup required</span>
              <span><Check className="w-4 h-4 stroke-[var(--accent)] stroke-2" /> Works offline</span>
              <span><Check className="w-4 h-4 stroke-[var(--accent)] stroke-2" /> 100% private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo"><span className="footer-pro">PRO</span>TOCOL</span>
            <span className="footer-by">by MultiFactor Solutions</span>
          </div>
          <div className="footer-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div>
        </div>
        <div className="footer-copyright">© 2025 MultiFactor Solutions. All rights reserved.</div>
        <div className="footer-legal">Legal disclaimer — This app is a personal tracking tool for informational purposes only. It is not medical advice, a diagnostic tool, or substitute for professional healthcare. Always consult with a licensed healthcare provider regarding your treatment protocol.</div>
      </footer>
    </div>
  );
};

export default Landing;
