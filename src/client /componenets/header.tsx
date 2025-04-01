import { Helmet } from "react-helmet";
import { useNavigate, Link} from "react-router-dom";
import { useContext } from "react";
import { LogStatus } from "../state/Context";
import axios from "axios";



const Header = function Header() {
  
    const navigate = useNavigate();
    const {status, setStatus} = useContext(LogStatus);
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:4000";

    const handleLogout = ()=>{
        setStatus(false);
        navigate("/signin");
        axios.post(`${API_URL}/api/logout`, {status:status}, {
        withCredentials: true
       })

    }
   
    console.log(status)
    return (
        <>
        
            <Helmet>
                <title>Art Review - Community Art Platform</title>
                <meta name="description" content="Join Art Review to share and review artwork with our creative community" />
                <meta name="keywords" content="art review, art community, artwork sharing" />
                <meta property="og:title" content="Art Review - Community Art Platform" />
                <meta property="og:description" content="Join our community to share and review artwork" />
                <meta property="og:type" content="website" />
            </Helmet>
          
            <header className="sticky top-0 bg-gray-900 text-white shadow-lg" aria-label="header">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to='/'>
                    <h1 className="text-2xl font-bold tracking-tight hover:text-gray-300 cursor-pointer transition-colors">
                        Art Review
                    </h1>
                    </Link>
                    <nav className="flex gap-4">
                        <button
                            onClick={() => navigate("/signin")}
                            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                            type="button"
                        >
                           {status ? <div onClick={handleLogout}>Logout</div> : <div>Signin</div>} 
                        </button>
                        { !status &&
                        <button
                            onClick={() => navigate("/signup")}
                            className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
                            type="button"
                        >
                            Signup
                        </button>
                       }
                    </nav>
                </div>
            </header>
            
        </>
    );
};
export default Header;