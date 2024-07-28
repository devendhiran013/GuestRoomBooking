import React, { useState, useEffect } from 'react';
import "../styles/List.scss";
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setListings } from '../redux/state';
import Loader from '../components/Loader';
import ListingCard from '../components/ListingCard';
import Footer from '../components/Footer';

const CategoryPage = () => {
  const [loading, setLoading] = useState(true); // State to track loading status
  const { category } = useParams(); // Get the category from the URL parameters
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const listings = useSelector((state) => state.listings); // Get listings from the Redux store

  // Fetch listings based on the category from the URL
  const getFeedListings = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties?category=${category}`, {
          method: "GET",
        }
      );
      const data = await response.json();
      dispatch(setListings({ listings: data })); // Dispatch action to update listings in Redux store
      setLoading(false); // Set loading to false once data is fetched
    } catch (err) {
      console.log("Fetch listing failed", err.message);
    }
  };

  // Fetch listings whenever the category changes
  useEffect(() => {
    getFeedListings();
  }, [category]);

  return loading ? <Loader /> : ( // Show loader while fetching data
    <div>
      <Navbar /> {/* Render Navbar component */}
      <h1 className='title-list'>{category}</h1> {/* Display the category name */}
      <div className="list">
        {/* Render ListingCard components for each listing */}
        {listings.map((listing) => (
          <ListingCard
            key={listing._id}
            listingId={listing._id}
            listingPhotoPaths={listing.listingPhotoPaths}
            city={listing.city}
            province={listing.province}
            country={listing.country}
            category={listing.category}
            type={listing.type}
            price={listing.price}
            booking={false} // Assuming booking is false as default
          />
        ))}
      </div>
      <Footer /> {/* Render Footer component */}
    </div>
  );
}

export default CategoryPage;
