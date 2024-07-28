import "../styles/CreateListing.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { categories, types, facilities } from "../data";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { useState, useEffect } from "react";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  // State to manage selected category
  const [category, setCategory] = useState("");
  // State to manage selected type
  const [type, setType] = useState("");
  // State to manage location details of the listing
  const [formLocation, setFormLocation] = useState({
    streetAddress: "",
    aptSuite: "",
    city: "",
    province: "",
    country: "",
  });

  // Handle location input changes
  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({
      ...formLocation,
      [name]: value,
    });
  };

  // State to manage guest and bedroom counts
  const [guestCount, setGuestCount] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(1);
  // State to manage selected amenities
  const [amenities, setAmenities] = useState([]);

  // Handle selection and deselection of amenities
  const handleSelectAmenities = (facility) => {
    setAmenities((prevAmenities) =>
      prevAmenities.includes(facility)
        ? prevAmenities.filter((option) => option !== facility)
        : [...prevAmenities, facility]
    );
  };

  // State to manage uploaded photos
  const [photos, setPhotos] = useState([]);

  // Handle photo uploads
  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  // Handle photo reordering via drag-and-drop
  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
  };

  // Handle removing a photo from the list
  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  // State to manage listing description details
  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    highlight: "",
    highlightDesc: "",
    price: 0,
  });

  // Handle description input changes
  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({
      ...formDescription,
      [name]: value,
    });
  };

  // Get user info from Redux store and navigate function for redirection
  const user = useSelector((state) => state.user);
  const creatorId = user._id;
  const navigate = useNavigate();
  // State to manage error messages
  const [errorMessage, setErrorMessage] = useState(null);

  // Redirect non-admin users away from the create listing page
  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [user.role, navigate]);

  // Handle form submission to post new listing
  const handlePost = async (e) => {
    e.preventDefault();

    if (!category || !type) {
      setErrorMessage("Please select a category and type.");
      return;
    }
    if (guestCount < 1 || bedroomCount < 1) {
      setErrorMessage("Please ensure all counts are positive numbers.");
      return;
    }

    try {
      // Prepare form data for submission
      const listingForm = new FormData();
      listingForm.append("creator", creatorId);
      listingForm.append("category", category);
      listingForm.append("type", type);
      listingForm.append("streetAddress", formLocation.streetAddress);
      listingForm.append("aptSuite", formLocation.aptSuite);
      listingForm.append("city", formLocation.city);
      listingForm.append("province", formLocation.province);
      listingForm.append("country", formLocation.country);
      listingForm.append("guestCount", guestCount);
      listingForm.append("bedroomCount", bedroomCount);
      listingForm.append("amenities", amenities.join(","));
      listingForm.append("title", formDescription.title);
      listingForm.append("description", formDescription.description);
      listingForm.append("highlight", formDescription.highlight);
      listingForm.append("highlightDesc", formDescription.highlightDesc);
      listingForm.append("price", formDescription.price);

      // Append photos to the form data
      photos.forEach((photo) => {
        listingForm.append("listingPhotos", photo);
      });

      // Submit the form data to the server
      const response = await fetch("http://localhost:3001/properties/create", {
        method: "POST",
        body: listingForm,
      });

      if (response.ok) {
        navigate("/"); // Redirect to homepage on success
      } else {
        setErrorMessage("Failed to create listing. Please try again.");
      }
    } catch (err) {
      console.log("Publish Listing failed", err.message);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-listing">
        <h1>Publish Your Place</h1>
        <form onSubmit={handlePost}>
          <div className="create-listing_step1">
            <h2>Tell us about your place</h2>
            <hr />
            <h3>Which of these categories best describes your place?</h3>
            <div className="category-list">
              {/* Render category options */}
              {categories?.map((item, index) => (
                <div
                  className={`category ${category === item.label ? "selected" : ""}`}
                  key={index}
                  onClick={() => setCategory(item.label)}
                >
                  <div className="category_icon">{item.icon}</div>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>

            <h3>What type of place will guests have?</h3>
            <div className="type-list">
              {/* Render type options */}
              {types?.map((item, index) => (
                <div
                  className={`type ${type === item.name ? "selected" : ""}`}
                  key={index}
                  onClick={() => setType(item.name)}
                >
                  <div className="type_text">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="type_icon">{item.icon}</div>
                </div>
              ))}
            </div>

            <h3>Place located?</h3>
            <div className="full">
              <div className="location">
                <p>Street Address</p>
                <input
                  type="text"
                  placeholder="Street Address"
                  name="streetAddress"
                  value={formLocation.streetAddress}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <p>Apartment, Suite, etc. (if applicable)</p>
                <input
                  type="text"
                  placeholder="Apt, Suite, etc. (if applicable)"
                  name="aptSuite"
                  value={formLocation.aptSuite}
                  onChange={handleChangeLocation}
                />
              </div>
              <div className="location">
                <p>City</p>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={formLocation.city}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <p>State</p>
                <input
                  type="text"
                  placeholder="Province"
                  name="province"
                  value={formLocation.province}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
              <div className="location">
                <p>Country</p>
                <input
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={formLocation.country}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <h3>Share some basics about your place</h3>
            <div className="basics">
              <div className="basic">
                <p>Guests</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => guestCount > 1 && setGuestCount(guestCount - 1)}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{guestCount}</p>
                  <AddCircleOutline
                    onClick={() => setGuestCount(guestCount + 1)}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>

              <div className="basic">
                <p>Rooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => bedroomCount > 1 && setBedroomCount(bedroomCount - 1)}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                  <p>{bedroomCount}</p>
                  <AddCircleOutline
                    onClick={() => setBedroomCount(bedroomCount + 1)}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: variables.pinkred },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="create-listing_step2">
            <h2>Make your place stand out</h2>
            <hr />

            <h3>Facilities that place offer</h3>
            <div className="amenities">
              {/* Render facility options */}
              {facilities?.map((item, index) => (
                <div
                  className={`facility ${amenities.includes(item.name) ? "selected" : ""}`}
                  key={index}
                  onClick={() => handleSelectAmenities(item.name)}
                >
                  <div className="facility_icon">{item.icon}</div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>

            <h3>Add photos of the place</h3>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="photos"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.length < 1 && (
                      <>
                        <input id="image" type="file" style={{ display: "none" }} accept="image/*" onChange={handleUploadPhotos} multiple
                        />
                        <label htmlFor="image" className="alone">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}

                    {photos.length >= 1 && (
                      <>
                        {photos.map((photo, index) => (
                          <Draggable
                            key={index}
                            draggableId={index.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="photo"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt="place"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(index)}
                                >
                                  <BiTrash />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        <input  id="image"  type="file"  style={{ display: "none" }}  accept="image/*"  onChange={handleUploadPhotos}  multiple />
                        <label htmlFor="image" className="together">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <h3>Describe The Place</h3>
            <div className="description">
              <p>Title</p>
              <input  type="text"  placeholder="Title"  name="title"  value={formDescription.title}  onChange={handleChangeDescription}  required/>
              <p>Description</p>
              <textarea  type="text"  placeholder="Description"  name="description"  value={formDescription.description}  onChange={handleChangeDescription}  required/>
              <p>Highlight</p>
              <input  type="text"  placeholder="High"  name="highlight"  value={formDescription.highlight}  onChange={handleChangeDescription}  required
              />
              <p>Highlight details</p>
              <textarea  type="text" placeholder="Highlight details"  name="highlightDesc"  value={formDescription.highlightDesc}  onChange={handleChangeDescription}  required />
              <p>PRICE</p>
              <span>₹</span>
              <input type="number" placeholder="100"  name="price"  value={formDescription.price} 
               onChange={handleChangeDescription}  className="price"  required/>
            </div>
          </div>

          <button className="submit_btn" type="submit">
            CREATE YOUR LISTING
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateListing;
