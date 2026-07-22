import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-3xl font-bold text-white">
            Blog<span className="text-blue-500">Hub</span>
          </h2>

          <p className="mt-4 text-gray-400 leading-7">
            Discover amazing stories, share your thoughts, and connect
            with writers around the world.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                className="hover:text-blue-500 duration-300"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/create-blog"
                className="hover:text-blue-500 duration-300"
              >
                Create Blog
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="hover:text-blue-500 duration-300"
              >
                Profile
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="hover:text-blue-500 duration-300"
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-5">
            Connect With Us
          </h3>

          <div className="flex gap-5 text-2xl">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white hover:scale-110 transition"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500 hover:scale-110 transition"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-400 hover:scale-110 transition"
            >
              <FaTwitter />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 hover:scale-110 transition"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center">

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} BlogHub. All rights reserved.
          </p>

          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            Built with ❤️ using React, Redux Toolkit, Node.js & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;