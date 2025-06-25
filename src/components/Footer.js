// components/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="gradient-bg text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <lottie-player src="https://assets3.lottiefiles.com/packages/lf20_5tkzkblw.json" background="transparent" speed="1" style={{ width: '30px', height: '30px' }} loop autoPlay></lottie-player>
              <span className="text-xl font-bold">CampusFind</span>
            </div>
            <p className="text-sm opacity-80">Helping students reunite with their lost belongings since 2023.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-sm opacity-80 hover:opacity-100 transition">Home</a></li>
              <li><a href="#listings" className="text-sm opacity-80 hover:opacity-100 transition">Browse Items</a></li>
              <li><a href="#report" className="text-sm opacity-80 hover:opacity-100 transition">Report Item</a></li>
              <li><a href="#how-it-works" className="text-sm opacity-80 hover:opacity-100 transition">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-sm opacity-80 hover:opacity-100 transition">FAQ</a></li>
              <li><a href="/privacy" className="text-sm opacity-80 hover:opacity-100 transition">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm opacity-80 hover:opacity-100 transition">Terms of Service</a></li>
              <li><a href="/contact" className="text-sm opacity-80 hover:opacity-100 transition">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477 4.072 4.072 0 01-1.847-.511v.051a4.106 4.106 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
            </div>
            <p className="text-sm opacity-80">Subscribe to notifications</p>
            <div className="flex mt-2">
              <input type="email" className="bg-white bg-opacity-20 border-0 rounded-l-lg px-4 py-2 text-white placeholder-white placeholder-opacity-70 focus:outline-none w-full" placeholder="Your email" />
              <button className="bg-white text-purple-700 px-4 py-2 rounded-r-lg font-medium">→</button>
            </div>
          </div>
        </div>

        <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center text-sm opacity-80">
          <p>© 2023 CampusFind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;