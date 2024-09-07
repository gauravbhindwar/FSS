import React from "react";
import  SidebarDemo  from "@/components/Base/Header/sidebar"; 
//Options for what a user can do
//1. Buttons to redirect to pages to fill form
//2. Check Form status -- pending confirmed rejected
//3. Can check the data he/she has filled
//4. can take printout in form of pdf
//5. 
const page = () => {


  return <div className="w-[100vw] h-[100vh]">
    <SidebarDemo />
    </div>;
};

export default page;
