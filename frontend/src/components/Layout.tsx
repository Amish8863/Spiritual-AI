import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
// import ScrollStorytelling from './ScrollStorytelling';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Scroll-driven storytelling background */}
      {/* <ScrollStorytelling /> */}
      
      {/* Grain overlay for texture */}
      <div className="grain-overlay" />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
