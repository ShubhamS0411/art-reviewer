import { FaLinkedinIn, FaGithub, FaLink} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4 md:px-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
        
        <div className="md:pr-6">
          <h2 className="text-xl font-semibold text-white">Art Review</h2>
          <p className="mt-4 text-sm">
            Art Review is a platform where you can share your art with the world or enrich the community with your insightful reviews.
          </p>
        </div>

       
        <div className="md:pl-6 md:border-l md:border-gray-700">
          <h3 className="font-semibold text-white mb-2">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
            <li><a href="/Homepage" className="hover:text-white">Homepage</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

       
        <div className="md:pl-6 md:border-l md:border-gray-700">
          <h3 className="font-semibold text-white mb-2">Activities</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/signup" className="hover:text-white">Reviewer</a></li>
            <li><a href="/signup" className="hover:text-white">Creator</a></li>
            <li><a href="/signin" className="hover:text-white">Enroll</a></li>
          </ul>
        </div>

       
        <div className="md:pl-6 md:border-l md:border-gray-700">
          <h3 className="font-semibold text-white mb-2">Follow Us</h3>
          <div className="flex space-x-4 mt-4 text-xl">
            <a href="https://github.com/ShubhamS0411" className="hover:text-white"><FaGithub/></a>
            <a href="www.linkedin.com/in/shubham041121" className="hover:text-white"><FaLinkedinIn /></a>
            <a href="https://portfolioget.vercel.app" className="hover:text-white"><FaLink /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 border-gray-700 mt-8">
        &copy; {new Date().getFullYear()} Art Review. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
