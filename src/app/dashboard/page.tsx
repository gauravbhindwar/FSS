import React from "react";
import SidebarDemo from "@/components/Base/Header/sidebar";
import { cookies } from "next/headers";
const page = () => {
  const cookieStore = cookies();
  return (
    <div className="w-[100vw] h-[100vh]">
      <SidebarDemo />
    </div>
  );
};

export default page;
