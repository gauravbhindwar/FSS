import React from "react";
import { cookies } from "next/headers";
import UserDashboard from "@/components/Base/Header/sidebar";
const page = () => {
  const cookieStore = cookies();
  return (
    <div className="w-[100vw] h-[100vh]">
      <UserDashboard cookies={cookieStore} />
    </div>
  );
};

export default page;
