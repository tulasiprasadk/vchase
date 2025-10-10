/* eslint-disable @next/next/no-html-link-for-pages */
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              EventSponsor
            </h3>
            <p className="text-gray-600 mb-4">
              Connecting event organizers with sponsors to create amazing
              experiences.
            </p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} EventSponsor. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/events" className="text-gray-600 hover:text-gray-900">
                  Browse Events
                </a>
              </li>
              <li>
                <a href="/blogs" className="text-gray-600 hover:text-gray-900">
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6">
              <a
                href="/privacy"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Terms of Service
              </a>
              <a
                href="/contact"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
