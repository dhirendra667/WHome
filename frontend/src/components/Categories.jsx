import { categories } from "../data";
import { Link } from "react-router-dom";

const Categories = () => {
  return (
    <div className="flex flex-col items-center text-center bg-[#f8f8f8] py-[50px] px-[60px] sm:px-[20px]">
      <h1 className="text-[#0077b6] text-[40px] font-extrabold mb-[15px]">
        Explore Top Categories
      </h1>

      <p className="max-w-[700px] text-[20px]">
        Explore our wide range of vacation rentals that cater to all types of
        travelers. Immerse yourself in the local culture, enjoy the comforts of
        home, and create unforgettable memories in your dream destination.
      </p>

      <div className="flex flex-wrap justify-center gap-[20px] py-[50px]">
        {categories?.slice(1, 7).map((category, index) => (
          <Link
            key={index}
            to={`/properties/category/${category.label}`}
            className="no-underline"
          >
            <div className="relative flex justify-center items-center w-[250px] h-[200px] cursor-pointer group">
              <img
                src={category.img}
                alt={category.label}
                className="absolute w-full h-full object-cover"
              />
              <div className="absolute w-full h-full bg-black/55 transition-all duration-300 ease-in-out group-hover:w-[80%] group-hover:h-[80%]"></div>

              <div className="relative text-white">
                <div className="text-[45px] flex justify-center">{category.icon}</div>
                <p className="font-semibold">{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
