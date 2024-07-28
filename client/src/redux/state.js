import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  listings: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setListings: (state, action) => {
      state.listings = action.payload.listings;
    },
    setTripList: (state, action) => {
      if (state.user) {
        state.user.tripList = action.payload;
      }
    },
    setWishList: (state, action) => {
      if (state.user) {
        state.user.wishList = action.payload; // Corrected the spelling here
      }
    },
  },
});
export const { setLogin, setLogout, setListings, setTripList, setWishList } = userSlice.actions;
export default userSlice.reducer;