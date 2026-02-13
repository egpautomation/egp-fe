// @ts-nocheck
// EGP-style footer for root layout (login, registration, public pages).

import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

const Footer = () => {
  const quickLinks = [
    { label: "এটি কিভাবে কাজ করে", to: "/#how-it-works" },
    { label: "সেবা সমূহ", to: "/#services" },
    { label: "STL Calculation", to: "/#stl-calculation" },
    { label: "About Us", to: "/#about" },
  ];

  const services = [
    { label: "ইজিপি একাউন্ট ওপেন", to: "/#services" },
    { label: "ইজিপি ট্রেনিং", to: "/#services" },
    { label: "টেন্ডার সাবমিশন", to: "/#services" },
    { label: "কোম্পানি রেজিস্ট্রেশন", to: "/#services" },
  ];

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold text-[#4874c7]">ই-টেন্ডার বিডি</h3>
            </Link>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              আপনার টেন্ডার ব্যবস্থাপনা এখন আরও সহজ, দ্রুত এবং কার্যকর। আমরা প্রদান করি সম্পূর্ণ ই-টেন্ডার সমাধান।
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#4874c7] hover:bg-[#4874c7] hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#4874c7] hover:bg-[#4874c7] hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#4874c7] hover:bg-[#4874c7] hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#4874c7] hover:bg-[#4874c7] hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-600 hover:text-[#4874c7] transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="mr-2 text-[#4874c7] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">আমাদের সেবা</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    to={service.to}
                    className="text-gray-600 hover:text-[#4874c7] transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="mr-2 text-[#4874c7] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">যোগাযোগ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <HiMail className="w-5 h-5 text-[#4874c7] shrink-0 mt-0.5" />
                <span>info@etenderbd.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <HiPhone className="w-5 h-5 text-[#4874c7] shrink-0 mt-0.5" />
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <HiLocationMarker className="w-5 h-5 text-[#4874c7] shrink-0 mt-0.5" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} ই-টেন্ডার বিডি. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/#" className="text-sm text-gray-600 hover:text-[#4874c7] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/#" className="text-sm text-gray-600 hover:text-[#4874c7] transition-colors">
                Terms of Service
              </Link>
              <Link to="/#" className="text-sm text-gray-600 hover:text-[#4874c7] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
