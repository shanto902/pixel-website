
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Activities from "@/components/Activities";
import FoodDrink from "@/components/FoodDrink";
import Locations from "@/components/Locations";
import Booking from "@/components/Booking";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Activities />
      <FoodDrink />
      <Locations />
      <Booking />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
