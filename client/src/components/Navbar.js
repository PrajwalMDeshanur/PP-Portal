import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item"><Link to="/">Dashboard</Link></li>
        <li className="nav-item dropdown">
          <Link to="/upload-applications" className="dropbtn">Upload Applications</Link>
          <div className="dropdown-content">
            <Link to="/new-application">New Application</Link>
            <Link to="/bulk-upload-applications">Bulk Upload Applications</Link>
          </div>
        </li>
        <li className="nav-item"><Link to="/view-applications">View Applications</Link></li>
        <li className="nav-item dropdown">
          <Link to="/shortlisting" className="dropbtn">Shortlisting</Link>
          <div className="dropdown-content">
            <Link to="/create-shortlisting-criteria">Create Shortlisting Criteria</Link>
            <Link to="/generate-shortlist">Generate Shortlist</Link>
          </div>
        </li>
        <li className="nav-item"><Link to="/screening-tests">Screening Tests/Interviews</Link></li>
        <li className="nav-item"><Link to="/results-management">Results Management</Link></li>
        <li className="nav-item"><Link to="/reports">Reports & Analytics</Link></li>
        <li className="nav-item"><Link to="/user-management">User Management</Link></li>
        <li className="nav-item"><Link to="/settings">Settings</Link></li>
        <li className="nav-item"><Link to="/help-support">Help & Support</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
