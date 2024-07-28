import React, { useState, useEffect } from 'react';
import "../styles/List.scss";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setListings } from "../redux/state";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from '../components/Footer';
const Search = () => {
  const { search } = useParams();
  const listings = useSelector((state) => state.listings);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getSearchListings = async () => {
    try {
      const response = await fetch(`http://localhost:3001/properties/search/${search}`, {
        method: "GET",
      });
      const data = await response.json();
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch search list failed", err.message);
    } 
  };

  useEffect(() => {
    getSearchListings();
  }, [search]);

  return loading ? <Loader /> : (
    <div>
      <Navbar />
      <h1 className='title-list'>Search Results</h1>
      <div className="list">
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
            booking={false}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Search;
