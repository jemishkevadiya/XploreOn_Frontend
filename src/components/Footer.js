import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-section">
        <h4>Our Services</h4>
        <ul>
          <li>Flights</li>
          <li>Hotels</li>
          <li>Car Rentals</li>
          <li>Itinerary Generator</li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Useful Links</h4>
        <ul>
        <li><a href="#about-us">About Us</a></li>
        <li><a href="mailto:xploreon.co@gmail.com">Contact Us</a></li> {/* Opens the user's default email client */}
        <li><a href="#testimonials">Reviews</a></li> {/* Scrolls to the Testimonials section */}
        <li><a href="/signup">Sign Up</a></li> {/* Directs to the Sign Up page */}
        </ul>
      </div>
      <div className="footer-section">
        <h4>Socials</h4>
        <ul>
          <li>
          <a href="https://www.instagram.com/xploreonofficial/" target="_blank" rel="noopener noreferrer">
          <img src="/images/instagram.svg" alt="Instagram" /> Instagram
            </a>
          </li>
          <li>
          <a href="https://x.com/Xplore_On" target="_blank" rel="noopener noreferrer">
          <img src="/images/x1.svg" alt="X" /> X
            </a>
          </li>
          <li>
          <a href="https://www.youtube.com/@XploreOn" target="_blank" rel="noopener noreferrer">
          <img src="/images/youtube.svg" alt="YouTube" /> YouTube
            </a>
          </li>
          <li>
          <a href="mailto:xploreon.co@gmail.com">
          <img src="/images/gmail.svg" alt="Gmail" /> Gmail
            </a>
          </li>
        </ul>
      </div>
      <div className="footer-bottom">
        <p>© XPLOREON 2024 | ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  );
};

export default Footer;
