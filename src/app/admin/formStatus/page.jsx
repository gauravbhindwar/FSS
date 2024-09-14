import { cookies } from "next/headers";
import dynamic from "next/dynamic";

// Dynamically import the UserManagementDashboard component to ensure it's only loaded on the client side
const UserManagementDashboard = dynamic(() => import("@/components/admin-base/form-status/formStatus"), { ssr: false });

export default function Page() {
  const cookieStore = cookies();
  return <UserManagementDashboard cookies={cookieStore} />;
}