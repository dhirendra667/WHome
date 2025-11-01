const Slide = () => {
  return (
    <div
      className="w-screen h-[80vh] bg-cover bg-top bg-center flex items-start justify-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/assets/slide.jpg')",
      }}
    >
      <h1 className="text-white text-center text-[40px] p-10">
        The journey is yours to take, the welcome is ours to make. <br />
        Your journey begins here. Wherever life takes you, <br /> find your home with Wanderer’s Home.
      </h1>
    </div>
  );
};

export default Slide;


