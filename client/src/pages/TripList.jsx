import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import swal from "sweetalert";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/trips`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      dispatch(setTripList(data));
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripList();
  }, [userId, dispatch]);

  const handlePayNow = async (trip) => {
    const { listingId, startDate, endDate, totalPrice } = trip;
    const hostId = listingId?.creator;

    if (!listingId || !hostId) {
      console.log("Invalid trip data", trip);
      return;
    }

    const bookingDetails = {
      customerId: userId,
      hostId,
      listingId: listingId._id,
      startDate,
      endDate,
      totalPrice,
    };

    const onToken = async (token) => {
      bookingDetails.token = token;
      try {
        setLoading(true);
        const result = await axios.post("/bookings/bookroom", bookingDetails);
        if (result.data.success) {
          swal("Congratulations", "Your Room booked successfully", "success");
        } else {
          swal("Oops", result.data.error || "Something went wrong", "error");
        }
      } catch (error) {
        swal("Oops", "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    };

    return (
      <StripeCheckout
        stripeKey="pk_test_51Ph3j1GQkH6lH9CFHwaDKyP6hobbYVx0YDttaG4JlZ8N3rZ1WV9Lgv8UIoFUFbhidPvsaybWWKZJrp33zz5GXOmj00VmguzHmv"
        token={onToken}
        amount={totalPrice * 100}
        name="Book Room"
        currency="INR"
      >
        <button className="pay-now-button">Pay Now</button>
      </StripeCheckout>
    );
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList?.length > 0 ? (
          tripList.map((trip) => {
            const { listingId, startDate, endDate, totalPrice } = trip;
            const hostId = listingId?.creator;

            if (!listingId || !hostId) {
              console.log("Invalid trip data", trip);
              return null;
            }

            return (
              <div key={listingId._id} className="trip-card">
                <ListingCard
                  listingId={listingId._id}
                  creator={hostId}
                  listingPhotoPaths={listingId.listingPhotoPaths}
                  city={listingId.city}
                  province={listingId.province}
                  country={listingId.country}
                  category={listingId.category}
                  startDate={startDate}
                  endDate={endDate}
                  totalPrice={totalPrice}
                  booking={true}
                />
                <div style={{ float: "right" }}>
                  <StripeCheckout
                    stripeKey="pk_test_51Ph3j1GQkH6lH9CFHwaDKyP6hobbYVx0YDttaG4JlZ8N3rZ1WV9Lgv8UIoFUFbhidPvsaybWWKZJrp33zz5GXOmj00VmguzHmv"
                    token={(token) => handlePayNow({ ...trip, token })}
                    amount={totalPrice * 100}
                    name="Book Room"
                    currency="INR"
                  >
                    <button className="pay-now-button">Pay Now</button>
                  </StripeCheckout>
                </div>
              </div>
            );
          })
        ) : (
          <p>No trips found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TripList;
