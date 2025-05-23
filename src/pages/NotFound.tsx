
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 px-4 text-center">
        <h1 className="text-7xl md:text-9xl font-display neon-text-pink mb-6">404</h1>
        <p className="text-2xl md:text-3xl text-white mb-8">Oops! This page has rolled into the gutter</p>
        <p className="text-lg text-white/80 max-w-lg mb-10">
          The page you're looking for seems to have disappeared. Maybe it's time for a strike in a different direction!
        </p>
        <Button size="lg" className="bg-neon-blue hover:bg-neon-pink text-white text-lg transition-colors duration-300">
          <a href="/">Back to Home</a>
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
