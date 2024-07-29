import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false); // State to control the dropdown menu visibility

  const user = useSelector((state) => state.user); // Get the current user from Redux store
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const [search, setSearch] = useState(""); // State to handle search input
  const navigate = useNavigate(); // Hook to programmatically navigate

  return (
    <div className="navbar">
      {/* Logo and home link */}
      <a href="/">
        <img src="/assests/logo.png" alt="logo" />
      </a>

      {/* Search bar */}
      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Update search input state
        />
        <IconButton disabled={search === ""}>
          <Search
            sx={{ color: variables.pinkred }}
            onClick={() => { navigate(`/properties/search/${search}`) }} // Navigate to search results page
          />
        </IconButton>
      </div>

      <div className="navbar_right">
        {/* Conditionally render 'Become A Host' link based on user login status */}
        {user ? (
          <a href="/create-listing" className="host">
            Become A Host
          </a>
        ) : (
          <a href="/login" className="host">
            Become A Host
          </a>
        )}

        {/* User account button with dropdown menu */}
        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)} // Toggle dropdown menu visibility
        >
          <Menu sx={{ color: variables.darkgrey }} />
          {!user ? (
            <Person sx={{ color: variables.darkgrey }} />
          ) : (
            <span className="user-name">{user.firstName} {user.lastName}</span> // Display user name if logged in
          )}
        </button>

        {/* Dropdown menu for logged-out users */}
        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}

        {/* Dropdown menu for logged-in users */}
        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link to={`/${user._id}/trips`}>MY BOOKINGS</Link>
            <Link to={`/${user._id}/wishList`}>Wish List</Link>
            
            <Link
              to="/login"
              onClick={() => {
                dispatch(setLogout()); // Dispatch logout action and redirect to login page
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
