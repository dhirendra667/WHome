// src/pages/CreateListing.jsx
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { categories, types, facilities } from "../data";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useSelector, useDispatch } from "react-redux";
import { setPropertyList } from "../redux/state";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const CreateListing = () => {
  // Basic states
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const [formLocation, setFormLocation] = useState({
    streetAddress: "",
    aptSuite: "",
    city: "",
    province: "",
    country: "",
  });

  const [guestCount, setGuestCount] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(1);
  const [bedCount, setBedCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);

  const [amenities, setAmenities] = useState([]);

  // files (File objects)
  const [photos, setPhotos] = useState([]); // array of File
  // local preview urls (keeps same order)
  const [previews, setPreviews] = useState([]);

  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    highlight: "",
    highlightDesc: "",
    price: "",
  });


  const creatorId = useSelector((state) => state.user?._id); // ensure user is in redux
  const user = useSelector((state) => state.user); // Get the whole user object
  const token = useSelector((state) => state.token); // Might be needed for protected routes
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // keep previews in sync
  useEffect(() => {
    // create object URLs for files
    const urls = photos.map((file) => URL.createObjectURL(file));
    // release old ones
    previews.forEach((u) => URL.revokeObjectURL(u));
    setPreviews(urls);

    // cleanup on unmount
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  // handlers
  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation((p) => ({ ...p, [name]: value }));
  };

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription((p) => ({ ...p, [name]: value }));
  };

  const handleSelectAmenities = (facility) => {
    setAmenities((prev) =>
      prev.includes(facility) ? prev.filter((x) => x !== facility) : [...prev, facility]
    );
  };

  const handleUploadPhotos = (e) => {
    if (!e.target.files) return;
    const arr = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...arr]);
    // reset input so same file can be reselected if needed
    e.target.value = null;
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // drag and drop reorder
  const handleDragPhoto = (result) => {
    if (!result.destination) return;
    const items = Array.from(photos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setPhotos(items);
  };

  // Submit
  const handlePost = async (e) => {
    e.preventDefault();

    if (!creatorId) {
      alert("You must be logged in to create a listing.");
      return;
    }

    // minimal validation
    if (!category || !type || !formLocation.streetAddress || !formDescription.title) {
      alert("Please fill required fields.");
      return;
    }

    // console.log(creatorId);           //to see the data 

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
    listingForm.append("bedCount", bedCount);
    listingForm.append("bathroomCount", bathroomCount);

    // Append amenities as multiple fields (backend will get array)
    amenities.forEach((a) => listingForm.append("amenities", a));

    listingForm.append("title", formDescription.title);
    listingForm.append("description", formDescription.description);
    listingForm.append("highlight", formDescription.highlight);
    listingForm.append("highlightDesc", formDescription.highlightDesc);
    listingForm.append("price", formDescription.price);

    photos.forEach((file) => {
      // field name must match multer config: "listingPhotos"
      listingForm.append("listingPhotos", file);
    });

    try {
        const res = await axios.post(
            "http://localhost:5000/api/v1/listing/create",
            listingForm,
            {
                // Ensure to include the Authorization header if your backend uses it for protection
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
                withCredentials: true,
            }
        );

        // Assuming  backend returns the new listing object in res.data.listing
        if (res.status === 201 || res.status === 200) {
            
            //  Update Redux State Immediately so that the dashboard loyout can be seen
            const newListingId = res.data.listing._id;
            
            // Get the current (stale) property list from Redux
            const currentPropertyList = user?.propertyList || [];
            
            // Create the new list with the new ID
            const newPropertyList = [...currentPropertyList, newListingId];
            
            // Dispatch the action to update Redux (which will trigger the Navbar re-render)
            dispatch(setPropertyList(newPropertyList));
            
            alert("Listing created successfully! Host Dashboard is now active.");
            navigate("/"); // Navigate after successful dispatch
        } else {
            console.error("Unexpected response", res);
            alert(res.data?.message || "Failed to create listing");
        }
    }catch (err) {
      console.error("Publish Listing failed", err?.response || err.message);
      alert(
        err?.response?.data?.message ||
          "Publish Listing failed. Check console for details."
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold text-blue-800">Publish Your Place</h1>

          {/* STEP 1 */}
          <form onSubmit={handlePost} className="space-y-8 mt-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow">
              <h2 className="text-xl font-semibold text-rose-500">Step 1: Tell us about your place</h2>
              <hr className="my-4" />
              <h3 className="mt-6 mb-3 text-lg font-semibold text-blue-800">Which of these categories best describes your place?</h3>

              <div className="flex flex-wrap gap-4">
                {categories?.map((item, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setCategory(item.label)}
                    className={`flex flex-col items-center justify-center w-[110px] h-[90px] rounded-lg border transition-all ${
                      category === item.label
                        ? "border-2 border-rose-500 bg-gray-50"
                        : "border-gray-300 hover:border-2 hover:border-rose-500 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <p className="text-sm font-semibold text-black text-center">{item.label}</p>
                  </button>
                ))}
              </div>

              <h3 className="mt-8 mb-3 text-lg font-semibold text-blue-800">What type of place will guests have?</h3>
              <div className="flex flex-col gap-4">
                {types?.map((t, i) => (
                  <div
                    key={i}
                    onClick={() => setType(t.name)}
                    className={`flex items-center justify-between max-w-full md:max-w-2xl p-4 rounded-lg border transition-all cursor-pointer ${
                      type === t.name ? "border-2 border-rose-500 bg-gray-50" : "border-gray-300 hover:border-2 hover:border-rose-500 hover:bg-gray-50"
                    }`}
                  >
                    <div className="max-w-[65%]">
                      <h4 className="font-semibold">{t.name}</h4>
                      <p className="text-sm text-gray-600">{t.description}</p>
                    </div>
                    <div className="text-2xl">{t.icon}</div>
                  </div>
                ))}
              </div>

              <h3 className="mt-8 mb-3 text-lg font-semibold text-blue-800">Where's your place located?</h3>

              <div className="space-y-4 max-w-3xl">
                <div>
                  <p className="font-semibold mb-2">Street Address</p>
                  <input
                    required
                    name="streetAddress"
                    value={formLocation.streetAddress}
                    onChange={handleChangeLocation}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="Street Address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold mb-2">Apartment, Suite, etc. (if applicable)</p>
                    <input
                      name="aptSuite"
                      value={formLocation.aptSuite}
                      onChange={handleChangeLocation}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200"
                      placeholder="Apt, Suite, etc."
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-2">City</p>
                    <input
                      name="city"
                      value={formLocation.city}
                      onChange={handleChangeLocation}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200"
                      placeholder="City"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold mb-2">Province</p>
                    <input
                      name="province"
                      value={formLocation.province}
                      onChange={handleChangeLocation}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200"
                      placeholder="Province"
                      required
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Country</p>
                    <input
                      name="country"
                      value={formLocation.country}
                      onChange={handleChangeLocation}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200"
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>
              </div>

              <h3 className="mt-8 mb-3 text-lg font-semibold text-blue-800">Share some basics about your place</h3>
              <div className="flex flex-wrap gap-4">
                {/* Guests */}
                <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg">
                  <p className="font-semibold">Guests</p>
                  <div className="flex items-center gap-3">
                    <RemoveCircleOutline
                      onClick={() => guestCount > 1 && setGuestCount((g) => g - 1)}
                      className="cursor-pointer"
                    />
                    <p className="text-lg font-semibold">{guestCount}</p>
                    <AddCircleOutline onClick={() => setGuestCount((g) => g + 1)} className="cursor-pointer" />
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg">
                  <p className="font-semibold">Bedrooms</p>
                  <div className="flex items-center gap-3">
                    <RemoveCircleOutline
                      onClick={() => bedroomCount > 1 && setBedroomCount((g) => g - 1)}
                      className="cursor-pointer"
                    />
                    <p className="text-lg font-semibold">{bedroomCount}</p>
                    <AddCircleOutline onClick={() => setBedroomCount((g) => g + 1)} className="cursor-pointer" />
                  </div>
                </div>

                {/* Beds */}
                <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg">
                  <p className="font-semibold">Beds</p>
                  <div className="flex items-center gap-3">
                    <RemoveCircleOutline onClick={() => bedCount > 1 && setBedCount((g) => g - 1)} className="cursor-pointer" />
                    <p className="text-lg font-semibold">{bedCount}</p>
                    <AddCircleOutline onClick={() => setBedCount((g) => g + 1)} className="cursor-pointer" />
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg">
                  <p className="font-semibold">Bathrooms</p>
                  <div className="flex items-center gap-3">
                    <RemoveCircleOutline
                      onClick={() => bathroomCount > 1 && setBathroomCount((g) => g - 1)}
                      className="cursor-pointer"
                    />
                    <p className="text-lg font-semibold">{bathroomCount}</p>
                    <AddCircleOutline onClick={() => setBathroomCount((g) => g + 1)} className="cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow">
              <h2 className="text-xl font-semibold text-rose-500">Step 2: Make your place stand out</h2>
              <hr className="my-4" />

              <h3 className="mt-4 mb-3 text-lg font-semibold text-blue-800">Tell guests what your place has to offer</h3>
              <div className="flex flex-wrap gap-4">
                {facilities?.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectAmenities(f.name)}
                    className={`flex flex-col items-center justify-center w-[200px] h-[90px] rounded-lg border transition-all ${
                      amenities.includes(f.name)
                        ? "border-2 border-rose-500 bg-gray-50"
                        : "border-gray-300 hover:border-2 hover:border-rose-500 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <p className="text-sm font-semibold">{f.name}</p>
                  </button>
                ))}
              </div>

              <h3 className="mt-8 mb-3 text-lg font-semibold text-blue-800">Add some photos of your place</h3>

              <DragDropContext onDragEnd={handleDragPhoto}>
                <Droppable droppableId="photos" direction="horizontal">
                  {(provided) => (
                    <div
                      className="flex flex-wrap gap-4"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {/* If no photos */}
                      {photos.length < 1 && (
                        <>
                          <input
                            ref={inputRef}
                            id="image"
                            type="file"
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleUploadPhotos}
                            multiple
                          />
                          <label
                            htmlFor="image"
                            onClick={() => inputRef.current && inputRef.current.click()}
                            className="w-[250px] h-[150px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
                          >
                            <div className="text-4xl text-gray-600">
                              <IoIosImages />
                            </div>
                            <p className="font-semibold mt-2">Upload from your device</p>
                          </label>
                        </>
                      )}

                      {/* If there are photos */}
                      {photos.length >= 1 &&
                        photos.map((photo, index) => (
                          <Draggable key={index} draggableId={index.toString()} index={index}>
                            {(providedDr) => (
                              <div
                                ref={providedDr.innerRef}
                                {...providedDr.draggableProps}
                                {...providedDr.dragHandleProps}
                                className="relative w-[250px] h-[150px] rounded-lg overflow-hidden"
                              >
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt={`photo-${index}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(index)}
                                  className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                                >
                                  <BiTrash />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}

                      {/* Another upload label while there are photos */}
                      <div className="flex items-center">
                        <input
                          id="image-2"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                          ref={inputRef}
                        />
                        <label
                          htmlFor="image-2"
                          onClick={() => inputRef.current && inputRef.current.click()}
                          className="w-[250px] h-[150px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
                        >
                          <div className="text-4xl text-gray-600">
                            <IoIosImages />
                          </div>
                          <p className="font-semibold mt-2">Upload from your device</p>
                        </label>
                      </div>

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <h3 className="mt-8 mb-3 text-lg font-semibold text-blue-800">What make your place attractive and exciting?</h3>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">Title</p>
                  <input
                    required
                    name="title"
                    value={formDescription.title}
                    onChange={handleChangeDescription}
                    className="w-full max-w-[600px] border border-gray-300 rounded-lg px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="Title"
                  />
                </div>

                <div>
                  <p className="font-semibold mb-2">Description</p>
                  <textarea
                    required
                    name="description"
                    value={formDescription.description}
                    onChange={handleChangeDescription}
                    className="w-full max-w-[600px] border border-gray-300 rounded-lg px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="Describe your place..."
                  />
                </div>

                <div>
                  <p className="font-semibold mb-2">Highlight</p>
                  <input
                    required
                    name="highlight"
                    value={formDescription.highlight}
                    onChange={handleChangeDescription}
                    className="w-full max-w-[600px] border border-gray-300 rounded-lg px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="Short highlight"
                  />
                </div>

                <div>
                  <p className="font-semibold mb-2">Highlight details</p>
                  <textarea
                    required
                    name="highlightDesc"
                    value={formDescription.highlightDesc}
                    onChange={handleChangeDescription}
                    className="w-full max-w-[600px] border border-gray-300 rounded-lg px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="Highlight details..."
                  />
                </div>

                <div>
                  <p className="font-semibold mb-2">Now, set your PRICE</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">$</span>
                    <input
                      required
                      type="number"
                      name="price"
                      value={formDescription.price}
                      onChange={handleChangeDescription}
                      className="w-[200px] border border-gray-300 rounded-lg px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="py-3 px-6 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold shadow transition"
              >
                CREATE YOUR LISTING
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CreateListing;

