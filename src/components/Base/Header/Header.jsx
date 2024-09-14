import React from "react";
import "./Header.css";
import Image from "next/image";

const Header = () => {
  return (
    <div className="header">
      <div className="header-icon">
        <Image
          src="/muj-logo.svg"
          alt="Logo"
          className="svg-icon"
          width={530}
          height={160}
        />
      </div>
    </div>
  );
};

export default Header;
