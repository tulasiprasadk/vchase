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
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <a href="/privacy" className="hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-gray-900">
                Terms of Service
              </a>
              <a href="/careers" className="hover:text-gray-900">
                Careers
              </a>
              <a href="/service-policy" className="hover:text-gray-900">
                Service Policy
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              © {new Date().getFullYear()} EventSponsor. All rights reserved.
            </p>
            <div className="mt-6 border-b border-gray-200 w-full"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
