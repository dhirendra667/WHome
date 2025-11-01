import { LocationOn, LocalPhone, Email, Facebook, Instagram, Twitter, YouTube  } from "@mui/icons-material";

const Footer = () => {
  return (
    <div className="flex justify-between items-center gap-12 px-[70px] py-2 lg:px-[30px] flex-wrap">
      
      {/* Left Section */}
      <div className="max-w-[400px] flex flex-col items-start">
        <a href="/">
          <img src="/assets/logo.png" alt="logo" className="w-[250px] max-h-[150px] mb-5" />
        </a>

        {/* Socials (optional if you have icons later) */}
        {/* <div className="flex gap-6 mt-5">
          <div className="w-10 h-10 rounded-full bg-[#FF385C] flex justify-center items-center cursor-pointer transition-transform duration-500 ease-in-out hover:scale-125">
            <SomeIcon className="text-white" />
          </div>
        </div> */}
        <div className="flex gap-6 mt-5">
  <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-[#000053] ml-5 mb-5 flex justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
  >
    <Facebook className="text-white" />
  </a>

  <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-[#000053] flex justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
  >
    <Instagram className="text-white" />
  </a>

  <a
    href="https://twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-[#000053] flex justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
  >
    <Twitter className="text-white" />
  </a>

  <a
    href="https://youtube.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-[#000053] flex justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
  >
    <YouTube className="text-white" />
  </a>
</div>

      </div>

      {/* Center Section */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-3">Useful Links</h3>
        <ul className="list-none mt-5 space-y-2 cursor-pointer">
          <li className="hover:text-[#FF385C]">About Us</li>
          <li className="hover:text-[#FF385C]">Terms and Conditions</li>
          <li className="hover:text-[#FF385C]">Return and Refund Policy</li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="max-w-[350px]">
        <h3 className="text-lg font-semibold mb-5">Contact</h3>
        
        <div className="flex items-center mb-4">
          <LocalPhone />
          <p className="ml-5">+1 234 567 890</p>
        </div>

        <div className="flex items-center mb-4">
          <Email />
          <p className="ml-5">WHome@support.com</p>
        </div>

        <img src="/assets/payment.png" alt="payment" className="mt-4" />
      </div>
    </div>
  );
};

export default Footer;
