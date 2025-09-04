import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import Fooddisplay from "../../components/FoodDisplay/FoodDisplay";
import FeaturedRestaurants from "../../components/FeaturedRestaurants/FeaturedRestaurants";
import Testimonials from "../../components/Testimonials/Testimonials";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = () => {
  const [category, setCategory] = useState("All");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  // Handle search query from URL parameters
  useEffect(() => {
    if (searchQuery) {
      // If there's a search query, we can filter the food display
      // This allows for direct search links like /?search=pizza
      setCategory("All"); // Reset category when searching
    }
  }, [searchQuery]);

  return (
    <div className="home">
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <Fooddisplay category={category} searchQuery={searchQuery} />
      <FeaturedRestaurants />
      <Testimonials />
      <AppDownload />
    </div>
  );
};

export default Home;
