import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Logo from "../components/Logo";
const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              {/* Replace with your actual logo */}
              <Logo className="logo-img" />
              <span className="logo-text">CalorieCrafter</span>
            </div>
            <div className="nav-buttons">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/signup" className="btn-signup">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Eat Smart,
                <span className="gradient-text"> Live Healthy</span>
              </h1>
              <p className="hero-subtitle">
                Order delicious meals that align with your health goals. Track
                calories, get personalized recommendations, and never compromise
                on taste.
              </p>
              <div className="hero-cta">
                <Link to="/signup" className="btn-primary">
                  Start Your Journey
                  <svg
                    className="arrow-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link to="/login" className="btn-secondary">
                  Already a member? Login
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Happy Users</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Restaurants</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Healthy Meals</div>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=800&fit=crop"
                  alt="Healthy food bowl"
                  className="floating-image"
                />
                <div className="floating-card calorie-card">
                  <div className="card-icon">🔥</div>
                  <div className="card-text">
                    <div className="card-label">Daily Calories</div>
                    <div className="card-value">1,850 / 2,000</div>
                  </div>
                </div>
                <div className="floating-card protein-card">
                  <div className="card-icon">💪</div>
                  <div className="card-text">
                    <div className="card-label">Protein</div>
                    <div className="card-value">85g / 100g</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Three simple steps to healthier eating
            </p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">📊</div>
              <h3 className="step-title">Set Your Goals</h3>
              <p className="step-description">
                Tell us about your height, weight, and health objectives. We'll
                calculate your personalized daily nutrition targets.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">🍽️</div>
              <h3 className="step-title">Browse Smart Menus</h3>
              <p className="step-description">
                Explore restaurant menus with complete nutrition info. Filter by
                calories, dietary preferences, and your goals.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">✅</div>
              <h3 className="step-title">Order with Confidence</h3>
              <p className="step-description">
                Get real-time calorie tracking and warnings. We'll suggest
                alternatives if you're exceeding your limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-large">
              <div className="feature-content">
                <span className="feature-badge">Smart Tracking</span>
                <h2 className="feature-title">
                  Never Guess Your Calories Again
                </h2>
                <p className="feature-description">
                  Every meal comes with complete nutrition information. Our
                  smart system tracks your daily intake and warns you before you
                  exceed your goals.
                </p>
                <ul className="feature-list">
                  <li>
                    <svg
                      className="check-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Real-time calorie counter in your cart
                  </li>
                  <li>
                    <svg
                      className="check-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Macronutrient breakdown (protein, carbs, fats)
                  </li>
                  <li>
                    <svg
                      className="check-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Weekly progress reports and insights
                  </li>
                </ul>
              </div>
              <div className="feature-image">
                <img
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=600&fit=crop"
                  alt="Nutrition tracking"
                />
              </div>
            </div>

            <div className="feature-large reverse">
              <div className="feature-content">
                <span className="feature-badge">Personalized</span>
                <h2 className="feature-title">Recommendations Just For You</h2>
                <p className="feature-description">
                  Our AI analyzes your health profile and preferences to suggest
                  meals that align with your goals without compromising on
                  taste.
                </p>
                <ul className="feature-list">
                  <li>
                    <svg
                      className="check-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Filter by dietary restrictions (vegan, keto, gluten-free)
                  </li>
                  <li>
                    <svg
                      className="check-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Get healthier alternatives for high-calorie items
                  </li>
                  <li>
                    <svg
                      className="check-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Discover new restaurants that match your goals
                  </li>
                </ul>
              </div>
              <div className="feature-image">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop"
                  alt="Personalized meals"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Benefits */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Your Health, Our Priority</h2>
            <p className="section-subtitle">
              Science-backed nutrition tracking for better health outcomes
            </p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Achieve Your Goals</h3>
              <p>
                Whether you want to lose weight, gain muscle, or maintain a
                healthy lifestyle, we help you stay on track.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">❤️</div>
              <h3>Heart Health</h3>
              <p>
                Monitor sodium, cholesterol, and saturated fats to support
                cardiovascular wellness.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>More Energy</h3>
              <p>
                Balanced nutrition means sustained energy throughout the day
                without crashes.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🧠</div>
              <h3>Mental Clarity</h3>
              <p>
                Proper nutrition supports cognitive function and mental
                well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Transform Your Eating Habits?
            </h2>
            <p className="cta-subtitle">
              Join thousands of users who are already achieving their health
              goals with NutriOrder
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn-cta-primary">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-cta-secondary">
                Sign In to Your Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <Logo className="logo-img" />
                <span className="footer-logo-text">CalorieCrafter</span>
              </div>
              <p className="footer-tagline">
                Smart nutrition tracking for a healthier you. Order meals that
                match your goals.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/features">Features</Link>
                </li>
                <li>
                  <Link to="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link to="/restaurants">For Restaurants</Link>
                </li>
                <li>
                  <Link to="/how-it-works">How It Works</Link>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/blog">Blog</Link>
                </li>
                <li>
                  <Link to="/careers">Careers</Link>
                </li>
                <li>
                  <Link to="/press">Press</Link>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Contact Us</h4>
              <ul className="footer-contact">
                <li>
                  <svg
                    className="contact-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a href="mailto:support@nutriorder.com">
                    support@CalorieCrafter.com
                  </a>
                </li>
                <li>
                  <svg
                    className="contact-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a href="tel:+1234567890">+1 (234) 567-890</a>
                </li>
                <li>
                  <svg
                    className="contact-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Raniguda Farm 5th lane, Rayagada 765001</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              © 2026 CalorieCrafter. All rights reserved.
            </p>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="separator">•</span>
              <Link to="/terms">Terms of Service</Link>
              <span className="separator">•</span>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
