import { IconButton } from "@mui/material";
import { Search, Person, Menu, Close } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import { DateRange } from "react-date-range"; // Imported for the pop-up

// Placeholder components for the pop-ups (I will expand these later)
const LocationPopup = ({ setSearch, search, handleSearch }) => (
  <div className="absolute top-16 left-0 w-80 bg-white rounded-3xl shadow-2xl p-4 z-50">
    <div className="text-sm font-semibold mb-3 px-3">Suggested destinations</div>
    {/* Placeholder content -  map the destinations here later */}
    <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100">
      <div className="p-2 rounded-full bg-gray-200">
        <Search sx={{ fontSize: 20 }} />
      </div>
      <div>
        <div className="font-medium">Nearby</div>
        <div className="text-sm text-gray-500">Find what's around you</div>
      </div>
    </div>
    <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100">
      <img src="/assets/countryside_cat.webp" alt="delhi" className="w-8 h-8 rounded-lg" />
      <div className="font-medium">New Delhi, Delhi</div>
    </div>
    {/* for Adding more locations here */}
  </div>
);

// use the DateRange component here for the Check In/Out popup
const DatesPopup = ({ dateRange, setDateRange }) => (
  <div className="absolute top-16 -left-20 bg-white rounded-3xl shadow-2xl p-4 z-50">
    <DateRange
      ranges={[{ startDate: dateRange.startDate, endDate: dateRange.endDate, key: 'selection' }]}
      onChange={(item) => setDateRange(item.selection)}
      minDate={new Date()}
      moveRangeOnFirstSelection={false}
      months={2}
      direction="horizontal"
      className="rounded-xl"
    />
  </div>
);

// 3. Guests Popup (Full Counter Logic)
const GuestsPopup = ({ guests, setGuests, activeSearchTab, setActiveSearchTab }) => {

    const updateGuests = (type, operation) => {
        setGuests(prev => {
            const newCount = operation === 'add' ? prev[type] + 1 : Math.max(0, prev[type] - 1);
            return { ...prev, [type]: newCount };
        });
    };

    // Helper component for the counter rows
    const GuestCounterRow = ({ type, title, subtitle, count }) => (
        <div className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
            <div>
                <div className="font-medium text-gray-800">{title}</div>
                <div className="text-sm text-gray-500">{subtitle}</div>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    className={`w-8 h-8 border rounded-full transition text-gray-700 
                                ${count > 0 ? 'border-gray-400 hover:border-black' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
                    onClick={(e) => { e.stopPropagation(); updateGuests(type, 'subtract'); }}
                    disabled={count === 0}
                >
                    -
                </button>
                <span className="font-semibold w-4 text-center">{count}</span>
                <button 
                    className="w-8 h-8 border border-gray-400 rounded-full hover:border-black transition text-gray-700"
                    onClick={(e) => { e.stopPropagation(); updateGuests(type, 'add'); }}
                >
                    +
                </button>
            </div>
        </div>
    );

    return (
        <div className="absolute top-16 right-0 w-80 bg-white rounded-3xl shadow-2xl p-6 z-50">
            <GuestCounterRow type="adults" title="Adults" subtitle="Ages 13 or above" count={guests.adults} />
            <GuestCounterRow type="children" title="Children" subtitle="Ages 2–12" count={guests.children} />
            <GuestCounterRow type="infants" title="Infants" subtitle="Under 2" count={guests.infants} />
            <GuestCounterRow type="pets" title="Pets" subtitle="Bringing a service animal?" count={guests.pets} />
        </div>
    );
};


const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSearchTab, setActiveSearchTab] = useState(null); // 'location', 'checkin', 'checkout', 'who'
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchBarRef = useRef(null);

  // Handle Search function will be more complex now (using all criteria)
  const handleSearch = () => {
    if (search.trim() !== "" || dateRange.startDate.toDateString() !== dateRange.endDate.toDateString() || guests.adults > 0) {
      // In a real app, you'd navigate with all parameters:
      // navigate(`/properties/search?location=${search}&start=${dateRange.startDate.toISOString()}&end=${dateRange.endDate.toISOString()}&guests=${guests.adults}`);
      
      // For simplicity 
      navigate(`/properties/search/${search || 'all'}`); 
      setActiveSearchTab(null); // Close the search widget
    }
  };
  
  // Close dropdown or search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close profile dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownMenu(false);
      }
      
      // Close search popups
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setActiveSearchTab(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Helper for Search Tabs
  const renderSearchTab = (tabName, title, subtitle) => (
    <div 
        className={`flex flex-col justify-center min-w-[80px] px-6 py-2 rounded-full cursor-pointer transition 
                    ${activeSearchTab === tabName 
                        ? 'bg-white shadow-md' 
                        : 'hover:bg-gray-100'}`}
        onClick={() => setActiveSearchTab(tabName)}
    >
        <div className="text-xs font-bold text-gray-700">{title}</div>
        <div className="text-sm text-gray-500">
            {tabName === 'location' && (search || subtitle)}
            {(tabName === 'checkin' || tabName === 'checkout') && (dateRange.startDate.toDateString() === dateRange.endDate.toDateString() ? subtitle : 'Add dates')}
            {tabName === 'who' && (guests.adults === 0 ? subtitle : `${guests.adults} Guests`)}
            {/* Fallback for initial state */}
            {activeSearchTab !== tabName && (tabName === 'location' || tabName === 'who' ) && subtitle}
        </div>
    </div>
  );

  // 1. Determine if the user is a host (has at least one property so that the host dashboard layout will open)
  const isHost = user?.propertyList?.length > 0;

  return (
    <div className="sticky top-0 bg-white z-[100] border-b border-gray-200"> 
        <div className="flex items-center justify-between px-16 py-1 relative sm:px-5">
            {/* Logo - Placeholder for the  logo  */}
            <Link to="/" className="flex items-center flex-shrink-0">
                <img
                    src="/assets/logo.png" 
                    alt="logo"
                    className="w-[150px] h-[80px] cursor-pointer" 
                />
            </Link>

            {/* Middle Section: The Search Widget */}
            <div 
                className="hidden lg:flex items-center border border-gray-200 rounded-full shadow-sm hover:shadow-md transition relative h-[60px]"
                ref={searchBarRef}
            >
                {/* Search Tabs Container */}
                <div className="flex h-full rounded-full">
                    {/* Location Tab */}
                    {renderSearchTab('location', 'Where', 'Search destinations')}

                    {/* Separators */}
                    <div className="h-full w-[1px] bg-gray-200"></div>

                    {/* Check In Tab */}
                    {renderSearchTab('checkin', 'Check in', 'Add dates')}

                    <div className="h-full w-[1px] bg-gray-200"></div>

                    {/* Check Out Tab */}
                    {renderSearchTab('checkout', 'Check out', 'Add dates')}

                    <div className="h-full w-[1px] bg-gray-200"></div>

                    {/* Who/Guests Tab with Search Button */}
                    <div className="flex items-center">
                        {renderSearchTab('who', 'Who', 'Add guests')}
                        
                        {/* Search Button */}
                        <IconButton 
                            onClick={handleSearch}
                            className="mr-2" 
                            sx={{
                                backgroundColor: '#ff385c', 
                                color: 'white', 
                                '&:hover': { backgroundColor: '#e03454' },
                                width: '48px',
                                height: '48px',
                                marginLeft: '-15px', // Adjust to bring it closer to the text
                            }}
                            disabled={!search && dateRange.startDate.toDateString() === dateRange.endDate.toDateString() && guests.adults === 0}
                        >
                            <Search />
                        </IconButton>
                    </div>
                </div>

                {/* --- Popups --- */}
                
                {/* Location Popup */}
                {activeSearchTab === 'location' && (
                    <LocationPopup setSearch={setSearch} search={search} handleSearch={handleSearch} />
                )}

                {/* Dates Popups (Check In / Check Out) */}
                {(activeSearchTab === 'checkin' || activeSearchTab === 'checkout') && (
                    <DatesPopup dateRange={dateRange} setDateRange={setDateRange} />
                )}
                
                {/* Guests Popup (Who) */}
                {activeSearchTab === 'who' && (
                    <GuestsPopup guests={guests} setGuests={setGuests} />
                )}
            </div>

            {/* Right Section: Host Link and Profile Menu */}
            <div className="flex items-center gap-5 relative" ref={dropdownRef}>
                {/* TOP-LEVEL HOST LINK: Dynamic link based on isHost status */}
                <Link
                    // If the user is a host, take them to the dashboard, otherwise to create a listing.
                    to={user ? (isHost ? "/host-dashboard" : "/create-listing") : "/login"}
                    className="text-gray-700 font-medium text-sm hover:bg-[#ff385c] p-3 rounded-full transition hidden sm:inline hover:text-white"
                >
                    {/* Dynamic text */}
                    {isHost ? "Host Dashboard" : "Become a Host"} 
                </Link>
                 
                {/* this is globe one for language but for the time being i dont want to implement it   */}
                {/* <IconButton className="hidden sm:inline">
                    <img src="/assets/globe.png" alt="globe" className="w-5 h-5" />
                </IconButton> */}

                {/* Profile / Menu Button - Hover/Click Logic */}
                <div
                    className="flex items-center gap-2 h-[42px] px-2 py-1 border border-gray-300 rounded-full bg-white cursor-pointer hover:shadow-md transition"
                    onClick={() => setDropdownMenu(!dropdownMenu)}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => {
                        if (!dropdownMenu) setHovered(false);
                    }}
                >
                    <Menu sx={{ color: "#555", fontSize: 20 }} />
                    {user?.avatar?.secure_url ? (
                        <img
                            src={user.avatar.secure_url}
                            alt="profile"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <Person sx={{ color: "#555", fontSize: 28 }} />
                    )}
                </div>

                {/* Dropdown Menu - Show if Clicked OR Hovered */}
                {(dropdownMenu || hovered) && (
                    <div 
                        className="absolute right-0 top-[60px] bg-white flex flex-col w-[200px] py-2 border border-gray-200 rounded-2xl shadow-lg z-[9999]"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        {/* Dropdown Links */}
                        {!user ? (
                            <>
                                <Link to="/login" className="px-4 py-2 text-gray-700 font-bold hover:bg-[#ff385c] hover:text-white p-3 rounded-sm transition hidden sm:inline">Log In</Link>
                                <Link to="/register" className="px-4 py-2 text-gray-700 font-medium hover:bg-[#ff385c] hover:text-white p-3 rounded-sm transition hidden sm:inline">Sign Up</Link>
                                <hr className="my-1"/>
                                <Link to="/create-listing" className="px-4 py-2 text-gray-700 font-medium hover:bg-[#ff385c] hover:text-white p-3 rounded-sm transition hidden sm:inline">Become A Host</Link>
                            </>
                        ) : (
                            // Logged In Links
                            <>
                                {isHost && (
                                    // Host Dashboard is the main link for hosts
                                    <Link to="/host-dashboard" 
                                        className="px-4 py-2 text-gray-700 font-bold hover:bg-[#ff385c] hover:text-white p-3 rounded-sm transition hidden sm:inline"
                                    >
                                        Host Dashboard
                                    </Link>
                                )}
                                
                                <Link to={`/${user._id}/trips`} className="px-4 py-2 text-gray-700 font-medium hover:bg-[#ff385c] hover:text-white p-3 rounded-sm transition hidden sm:inline">Booking List</Link>
                                <Link to={`/${user._id}/wishList`} className="px-4 py-2 text-gray-700 font-medium hover:bg-[#ff385c] hover:text-white p-3 rounded-sm transition hidden sm:inline">Wish List</Link>
                                
                                {/* --- (Host Specific Management Links) --- */}
                                {/* Adding the separator only if they are a host */}
                                {isHost && <hr className="my-1"/>} 

                                {/* If they are a host, display the direct management links */}
                                {isHost && (
                                    <>
                                        <Link to={`/${user._id}/properties`} className="px-4 py-2 text-gray-700 font-medium hover:bg-[#ff385c] hover:text-white p-3 rounded-sm transition hidden sm:inline">Property List</Link>
                                        <Link to={`/${user._id}/reservations`} className="px-4 py-2 text-gray-700 font-medium hover:bg-[#ff385c] hover:text-white p-3 rounded-sm transition hidden sm:inline">Reservation List</Link>
                                    </>
                                )}
                                
                                <Link to="/create-listing" className="px-4 py-2 text-gray-700 font-medium hover:bg-[#ff385c] hover:text-white p-3 rounded-sm transition hidden sm:inline">List a New Property</Link>
                                <hr className="my-1"/>
                                <button
                                    onClick={() => {
                                        dispatch(setLogout());
                                        setDropdownMenu(false);
                                        navigate("/login");
                                    }}
                                    className="px-4 py-2 text-left text-gray-700 font-medium hover:bg-[#ff385c] hover:text-white w-full p-3 rounded-sm transition hidden sm:inline"
                                >
                                    Log Out
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            

            {/* Mobile/Small Screen Search Icon */}
            <div className="flex lg:hidden items-center">
                <IconButton onClick={() => setActiveSearchTab('location')}>
                    <Search sx={{ color: "#ff385c" }} />
                </IconButton>
            </div>
        </div>
    </div>
  );

};

export default Navbar;

