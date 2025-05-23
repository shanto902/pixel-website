import React from "react";
import { Button } from "@/components/ui/button";

const FoodDrink: React.FC = () => {
  return (
    <section id="food-drink" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display neon-text-pink mb-6 pixelated-text">
              FOOD & DRINK
            </h2>
            <p className="text-xl text-white/80 mb-6">
              We serve up mouth-watering burgers, pizzas, and sides alongside
              craft beers, cocktails, and shakes to keep you fueled while you
              play.
            </p>
            <p className="text-xl text-white/80 mb-8">
              Our bars are stocked with a wide range of drinks from local craft
              beers to classic cocktails and everything in between.
            </p>
            <Button className="bg-neon-blue hover:bg-neon-pink text-white text-lg transition-colors duration-300">
              View Menu
            </Button>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Burger"
              className="w-full h-[200px] aspect-square object-cover rounded-lg animate-float"
            />
            <img
              src="https://images.unsplash.com/photo-1514361659284-59851c90d011?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Cocktail"
              className="w-full h-[200px] aspect-square object-cover rounded-lg animate-float"
              style={{ animationDelay: "0.5s" }}
            />
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Pizza"
              className="w-full h-[200px] aspect-square object-cover rounded-lg animate-float"
              style={{ animationDelay: "1s" }}
            />
            <img
              src="https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Beer"
              className="w-full h-[200px] aspect-square object-cover rounded-lg animate-float"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodDrink;
