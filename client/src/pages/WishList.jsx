import React from 'react';
import "../styles/List.scss";
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import ListingCard from '../components/ListingCard';
import Footer from '../components/Footer';
const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList);

  return (
    <div>
      <Navbar />
      <h1 className='title-list'>Your List</h1>
      <div className="list">
        {wishList.map((listing) => (
          <ListingCard
            key={listing._id} // Adding a unique key prop
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
      <Footer />
    </div>
  );
};

export default WishList;
