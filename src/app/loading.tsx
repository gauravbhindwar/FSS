import React from "react";
import Image from "next/image";

export default function Loading() {
  return <div>
    <Image
            src="/LoadingPage.svg"
            alt="Logo"
            className="login-icon w-screen hidden max-lg:block"
            width={500}
            height={300}
          />
        Loading ...
  </div>;
};