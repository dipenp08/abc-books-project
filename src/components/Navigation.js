import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
  <Link to="/">Dashboard</Link>
  <Link to="/books">View Books</Link>
  <Link to="/add-book">Add Book</Link>
  <Link to="/profile">Profile</Link>
</nav>
  );
}

export default Navigation;
