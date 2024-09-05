import React from "react";

const invalidUser = () => {
  return (
    <div className="flex items-center content-center h-screen">
      <div>
        <h1>Invalid User</h1>
        <div>
          <div className="col-12 col-span-6 col-start-4 text-red-600 font-extrabold size-10">
            Contact Your Admin
          </div>
        </div>
      </div>
    </div>
  );
};

export default invalidUser;
