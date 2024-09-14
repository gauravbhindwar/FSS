import AdminDashboard from "@/components/admin-base/admin-dash/admDash";
import { cookies } from "next/headers";
function AdminPage() {
  const cookieStore = cookies();
  return (
    <div className="">
      <AdminDashboard cookies={cookieStore} />
    </div>
  );
}
export default AdminPage;
