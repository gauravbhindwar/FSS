import Head from "next/head";

function ProfilePage() {
  return (
    <div className="max-w-md mx-auto p-4 pt-6 md:p-6 lg:p-12 bg-slate-500">
      <Head>
        <title>Profile Page</title>
      </Head>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            src="profile-picture.jpg"
            alt="Profile Picture"
            className="rounded-full w-48 h-48 mx-auto"
          />
          <h2 className="text-2xl font-bold text-center">Test User</h2>
        </div>
        <div className="md:w-2/3 md:pl-4">
          <div className="mb-4">
            <h3 className="text-lg font-bold">Contact Information</h3>
            <ul className="list-none mb-0">
              <li className="mb-2">
                <strong className="font-bold">Email:</strong> mujid@example.com
              </li>
              <li className="mb-2">
                <strong className="font-bold">Phone:</strong> +1 123 456 7890
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-bold">Professional Information</h3>
            <ul className="list-none mb-0">
              <li className="mb-2">
                <strong className="font-bold">Designation:</strong> Software
                Engineer
              </li>
              <li className="mb-2">
                <strong className="font-bold">Department:</strong> IT Department
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
