import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full max-w-full overflow-x-hidden pb-24 sm:pb-0">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
