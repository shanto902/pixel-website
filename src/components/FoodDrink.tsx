
import React from 'react';
import { Button } from "@/components/ui/button";

const FoodDrink: React.FC = () => {
  return (
    <section id="food-drink" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display neon-text-pink mb-6">FOOD & DRINK</h2>
            <p className="text-xl text-white/80 mb-6">
              We serve up mouth-watering burgers, pizzas, and sides alongside craft beers, cocktails, and shakes to keep you fueled while you play.
            </p>
            <p className="text-xl text-white/80 mb-8">
              Our bars are stocked with a wide range of drinks from local craft beers to classic cocktails and everything in between.
            </p>
            <Button className="bg-neon-blue hover:bg-neon-pink text-white text-lg transition-colors duration-300">
              View Menu
            </Button>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <img 
              src="https://images.ctfassets.net/w8fcmtakin9b/4Bbb0Qy2YfY7ui9Kfsrwru/80e676047b4fc6c153c36ce693644a43/burger__1_.png" 
              alt="Burger" 
              className="w-full h-auto rounded-lg animate-float"
            />
            <img 
              src="https://images.ctfassets.net/w8fcmtakin9b/5R7gmHP9OBtOjzxyNIUzHA/cc964c8023cf5374624ee8f7d3a5a2e4/Group_15__1_.png" 
              alt="Cocktail" 
              className="w-full h-auto rounded-lg animate-float" 
              style={{ animationDelay: "0.5s" }}
            />
            <img 
              src="https://images.ctfassets.net/w8fcmtakin9b/1TD3XCgFSRmjzxmz32KtDG/0417a6de85c0bae6cdcb97d3025a20cd/pizza__1_.png" 
              alt="Pizza" 
              className="w-full h-auto rounded-lg animate-float"
              style={{ animationDelay: "1s" }}
            />
            <img 
              src="https://images.ctfassets.net/w8fcmtakin9b/5VDZTepB7QxdGKxulJrleA/276c2c90350c41bc62e08f4b7e73c50f/2_pints.png" 
              alt="Beer" 
              className="w-full h-auto rounded-lg animate-float"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodDrink;
