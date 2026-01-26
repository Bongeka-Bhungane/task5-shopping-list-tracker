import React from "react";
import { Link } from "react-router-dom";

export default function LoggedNav() {
  return (
    <div>
      <Link to="/profile" className="">
        {" "}
        Profile
      </Link>
    </div>
  );
}
