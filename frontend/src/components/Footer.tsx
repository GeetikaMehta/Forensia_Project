import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Footer top section with About Us */}
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-sm">
              Forensia is an AI-powered platform aimed at revolutionizing
              data-driven decisions for businesses, organizations, and
              individuals, providing actionable insights on various
              sustainability metrics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul>
              <li>
                <Link to="/privacy" className="hover:text-gray-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gray-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom section with Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Forensia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
