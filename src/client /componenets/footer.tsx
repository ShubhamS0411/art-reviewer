import { FaLinkedinIn, FaGithub, FaLink } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-10">
        <div>
          <h2 className="text-2xl font-bold text-white">Art Review</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Art Review is a vibrant platform dedicated to showcasing your artwork and fostering a community through insightful reviews and creative collaboration.
          </p>
        </div>

        <div className="md:ml-12">
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="/dashboard"
                className="hover:text-white transition-colors duration-200"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/Homepage"
                className="hover:text-white transition-colors duration-200"
              >
                Homepage
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-white transition-colors duration-200"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Activities</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="/signup"
                className="hover:text-white transition-colors duration-200"
              >
                Become a Reviewer
              </a>
            </li>
            <li>
              <a
                href="/signup"
                className="hover:text-white transition-colors duration-200"
              >
                Join as a Creator
              </a>
            </li>
            <li>
              <a
                href="/signin"
                className="hover:text-white transition-colors duration-200"
              >
                Enroll Now
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-6 mt-4">
            <a
              href="https://github.com/ShubhamS0411"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/shubham041121"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="w-6 h-6" />
            </a>
            <a
              href="https://portfolioget.vercel.app"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLink className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} Art Review. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;