import  { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaUserCircle, FaBell, FaBars, FaChartBar, FaCogs, FaBook, FaQuestionCircle } from 'react-icons/fa';
import "./Dashboard.css";

const Layout = () => {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  

  const toggleSidebar = () => {
    setSidebarMinimized(!sidebarMinimized);
  };
 
    
     useEffect(() => {
       setLoggedInUser(localStorage.getItem('loggedInUser'));
     }, [])

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    window.location.reload(); // Redirect to login after logout
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🗣️ InterviewPro
        </div>
        <div className="nav-right">
          <button className="notification-btn">
            <FaBell />
          </button>
          <div className="profile">
            <button className="profile-btn" onClick={() => setDropdownVisible(!dropdownVisible)}>
              <FaUserCircle /> Welcome! {loggedInUser}
            </button>
            {dropdownVisible && (
              <div className="dropdown">
                <Link to="/dashboard/profile">Profile</Link>
                <Link to="/logout" onClick={handleLogout}>Logout</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarMinimized ? "minimized" : ""}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <ul>
          <li>
            <Link to="/dashboard">
              <FaChartBar /> {!sidebarMinimized && "Dashboard"}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/reports">
              <FaBook /> {!sidebarMinimized && "Reports"}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/profile">
              <FaCogs /> {!sidebarMinimized && "Profile"}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/help">
              <FaQuestionCircle /> {!sidebarMinimized && "Help"}
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarMinimized ? "expanded" : ""}`}>
        <Outlet /> {/* Render child routes dynamically */}
      </main>
    </div>
  );
};

export default Layout;
