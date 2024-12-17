import { useState } from "react";
import { FaChevronRight, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);

  const menus = [
    "Frontend",
    "Backend",
    "DevOps",
    "Machine Learning",
    "System Design",
    "Graphic Design",
  ];

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const getMenuRoute = (menu) => {
    // Map menu to the corresponding route
    switch (menu) {
      case "Frontend":
        return "/dashboard/frontend";
      case "Backend":
        return "/dashboard/backend"; 
      case "DevOps":
        return "/dashboard/devops"; 
      case "Machine Learning":
        return "/dashboard/machine-learning"; 
      case "System Design":
        return "/dashboard/system-design"; 
      case "Graphic Design":
        return "/dashboard/graphic-design"; 
      default:
        return "/dashboard"; // Default route if no menu is selected
    }
  };

  return (
    <div className="dashboard-content">
      <h2 className="header-text">Select to begin the interview process</h2>
      <div className="menu-container">
        {/* Menu Grid */}
        <div className="menu-grid">
          {menus.map((menu) => (
            <div
              key={menu}
              className={`menu-item ${selectedMenu === menu ? "selected" : ""}`}
              onClick={() => handleMenuClick(menu)}
            >
              {menu}
              {selectedMenu === menu && (
                <span className="tick">
                  <FaCheck />
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Button */}
        <Link
          to={selectedMenu ? getMenuRoute(selectedMenu) : "#"}
          className={`next-button ${!selectedMenu ? "disabled" : ""}`}
        >
          Next <FaChevronRight /> 
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
