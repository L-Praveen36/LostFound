// Footer.js
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
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition">FAQ</a></li>
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition">Privacy Policy</a></li>
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition">Terms of Service</a></li>
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition">FB</a>
              <a href="#" className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition">TW</a>
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
