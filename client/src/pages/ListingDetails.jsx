import React, { useEffect, useState } from 'react';
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from 'react-router-dom';
import { facilities } from '../data';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const today = new Date();
  const navigate = useNavigate();
  const customerId = useSelector((state) => state?.user?._id);

  const getListingDetails = async () => {
    if (!listingId) {
      setError("Invalid listing ID");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/properties/${listingId}`, {
        method: "GET",
      });
      const data = await response.json();

      console.log('Fetched data:', data);

      if (response.ok) {
        setListing(data);
      } else {
        setError(data.message || "Listing not found");
      }
      setLoading(false);
    } catch (err) {
      console.error("Fetch Listing Details failed", err.message);
      setError("Failed to fetch listing details");
      setLoading(false);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, [listingId]);

  const handleSubmit = async () => {
    if (!customerId) {
      console.error("User is not logged in.");
      return;
    }

    try {
      // Placeholder for payment token generation
      const paymentToken = 'dummy-payment-token'; // Replace with actual token generation

      const dayCount = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.userId,
        startDate: startDate.toDateString(),
        endDate: endDate.toDateString(),
        totalPrice: listing.price * dayCount,
        paymentToken,  // Include the payment token here
      };

      const response = await fetch("http://localhost:3001/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      const result = await response.json();

      if (response.ok) {
        navigate(`/${customerId}/trips`);
      } else {
        console.error("Submit booking failed", result.error);
      }
    } catch (err) {
      console.error("Submit booking failed", err.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!listing) {
    return <div>No listing data available</div>;
  }

  return (
    <>
      <Navbar />
      <div className="listing-details">
        <div className="title">
          <h1>{listing?.title}</h1>
        </div>
        <div className='photos'>
          {listing?.listingPhotoPaths?.map((item, index) => (
            item ? (
              <img
                key={index}
                src={`http://localhost:3001/${item.replace("public", "")}`}
                alt="listing photos"
              />
            ) : null
          ))}
        </div>
        <h2>{listing?.type} in {listing?.city}, {listing?.province}, {listing?.country}</h2>
        <p>{listing?.guestCount} guests - {listing?.bedroomCount} bedroom(s) - {listing?.bedCount} bed(s) - {listing?.bathroomCount} bathroom(s)</p>
        <hr />
        <div className="profile">
          {listing?.creator && (
            <>
              {listing.creator.profileImagePath ? (
                <img
                  src={`http://localhost:3001/${listing.creator.profileImagePath.replace("public", "")}`}
                  alt="creator profile"
                />
              ) : null}
              <h3>Hosted by {listing.creator.firstName} {listing.creator.lastName}</h3>
            </>
          )}
        </div>
        <hr />
        <h3>Description</h3>
        <p>{listing?.description}</p>
        <hr />
        <h3>{listing?.highlight}</h3>
        <p>{listing?.highlightDesc}</p>
        <hr />
        <div className="booking">
          <div>
            <h2>Facilities that we offer</h2>
            <div className="amenities">
              {listing?.amenities[0]?.split(",").map((item, index) => (
                item ? (
                  <div className="facility" key={index}>
                    <div className="facility_item">
                      {facilities.find((facility) => facility.name === item)?.icon}
                    </div>
                    <p>{item}</p>
                  </div>
                ) : null
              ))}
            </div>
          </div>
          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <p>Checkin</p>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={today}
                dateFormat="yyyy/MM/dd"
                selectsStart
                startDate={startDate}
                endDate={endDate}
                isClearable
                placeholderText="Select start date"
              />
              <p>Checkout</p>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                minDate={startDate}
                dateFormat="yyyy/MM/dd"
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                isClearable
                placeholderText="Select end date"
              />
              {startDate && endDate && (
                <>
                  <h2>₹{listing?.price} x {Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} {Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 > 1 ? 'days' : 'day'}</h2>
                  <h2>Total price: ₹{listing?.price * (Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1)}</h2>
                  <p>Start Date: {startDate.toDateString()}</p>
                  <p>End Date: {endDate.toDateString()}</p>
                </>
              )}
              <button className='button' type='button' onClick={handleSubmit}>Book Now</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListingDetails;
