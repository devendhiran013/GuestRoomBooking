import React, { useEffect, useState } from 'react';
import { categories } from '../data';
import "../styles/Listing.scss";
import Loader from './Loader';
import ListingCard from "./ListingCard";
import { useDispatch, useSelector } from 'react-redux';
import { setListings } from '../redux/state';

const Listing = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // State to track loading status
  const [selectedCategory, setSelectedCategory] = useState("All"); // State to track the selected category
  const [error, setError] = useState(null); // State to store error messages
  const listings = useSelector((state) => state.listings); // Get listings from the Redux store

  // Fetch listings based on the selected category
  const getFeedListings = async () => {
    try {
      const response = await fetch(
        selectedCategory !== "All"
          ? `http://localhost:3001/properties?category=${selectedCategory}` // Fetch listings for selected category
          : "http://localhost:3001/properties", // Fetch all listings if no category is selected
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch(setListings({ listings: data })); // Dispatch action to update the listings in Redux store
    } catch (err) {
      console.log("Fetch listing failed", err.message);
      setError("Failed to fetch listings. Please try again later."); // Set error message on failure
    } finally {
      setLoading(false); // Set loading to false once the fetch is complete
    }
  };

  // Fetch listings whenever the selected category changes
  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  return (
    <>
      {/* Category selection menu */}
      <div className='category-list'>
        {categories?.map((category, index) => (
          <div
            className={`category ${category.label === selectedCategory ? "selected" : ""}`}
            key={index}
            onClick={() => setSelectedCategory(category.label)} // Set the selected category on click
          >
            <div className="category_icon">{category.icon}</div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>
      {/* Display error message if there is an error */}
      {error && <div className="error-message">{error}</div>}
      {/* Display loader while fetching data, or display listings once data is fetched */}
      {loading ? <Loader /> : (
        <div className='listings'>
          {listings.map(({ _id, creator, listingPhotoPaths, city, province, country, category, type, price, booking=false }) => (
            <ListingCard
              key={_id}
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              province={province}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Listing;
