import React from "react";
import { assets } from "../../assets/assets";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img
            src={assets.logo}
            alt="Ari's Cafe Logo"
            className="footer-logo"
          />
          <p>
            Delicious food delivered to your doorstep. We connect you with the
            best restaurants in your area, ensuring fresh, hot meals every time.
          </p>
          <div className="footer-social-icons">
            <a href="https://www.facebook.com/arindam.das.450705" aria-label="Facebook" className="social-icon">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="https://x.com/ArindamDas02" aria-label="Twitter" className="social-icon">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="https://www.linkedin.com/in/arindam-das-a60826304/" aria-label="LinkedIn" className="social-icon">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>

        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About us</a>
            </li>
            <li>
              <a href="#delivery">Delivery</a>
            </li>
            <li>
              <a href="#privacy">Privacy policy</a>
            </li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>
              <a href="tel:+91 8420891899">
                <span className="contact-icon">📞</span>
                +91 8420891899
              </a>
            </li>
            <li>
              <a href="mailto:contact@ariscafe.com">
                <span className="contact-icon">✉️</span>
                dasarindam342@gmail.com
              </a>
            </li>
            <li>
              <span className="contact-icon">📍</span>
              103, prafulla nagar Belgharia Kolkata -700056
            </li>
          </ul>

          <div className="newsletter">
            <h3>Subscribe to our newsletter</h3>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email for newsletter"
                required
              />
              <button type="submit" aria-label="Subscribe to newsletter">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p className="footer-copyright">
          Copyright {currentYear} © Ari's Cafe - All Rights Reserved.
        </p>
        <div className="footer-links">
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#cookies">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
