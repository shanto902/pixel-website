
import React from 'react';
import Logo from './Logo';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-16 pb-8 pixel-bg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-white/70 mb-6">
              Premium bowling and entertainment venues across Thailand, featuring the best games, food, and drinks.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-neon-pink transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-neon-pink transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-neon-pink transition-colors duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-display mb-6 text-white pixelated-text">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#activities" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  Activities
                </a>
              </li>
              <li>
                <a href="#food-drink" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  Food & Drink
                </a>
              </li>
              <li>
                <a href="#locations" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  Locations
                </a>
              </li>
              <li>
                <a href="#booking" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  Book Now
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-display mb-6 text-white pixelated-text">More Info</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  Gift Vouchers
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  Corporate Events
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-display mb-6 text-white pixelated-text">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-neon-pink flex-shrink-0 mt-1" />
                <span className="text-white/70">
                  Pixel HQ, 42 Sukhumvit Road, Bangkok, Thailand, 10110
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-neon-pink" />
                <a href="tel:+6622345678" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  +66 2 234 5678
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-neon-pink" />
                <a href="mailto:info@pixel.co.th" className="text-white/70 hover:text-neon-blue transition-colors duration-300">
                  info@pixel.co.th
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <div className="text-center text-white/60 text-sm">
            <p>&copy; {currentYear} Pixel. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
