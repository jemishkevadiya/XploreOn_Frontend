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
          <li>About Us</li>
          <li>Contact Us</li>
          <li>Reviews</li>
          <li>Sign Up</li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Socials</h4>
        <ul>
          <li>
            <a href="#">
              <img src="/icons/instagram.svg" alt="Instagram" /> Instagram
            </a>
          </li>
          <li>
            <a href="#">
              <img src="/icons/twitter.svg" alt="Twitter" /> Twitter
            </a>
          </li>
          <li>
            <a href="#">
              <img src="/icons/youtube.svg" alt="YouTube" /> YouTube
            </a>
          </li>
          <li>
            <a href="#">
              <img src="/icons/gmail.svg" alt="Gmail" /> Gmail
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
