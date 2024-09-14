import AdminForm from "@/components/admin-base/admin-form/AdminForm";
import { cookies } from "next/headers";

export default function AddAdminPage() {
  const cookieStore = cookies();
  return (
    <div>
      <AdminForm cookies={cookieStore} />
    </div>
  );
}
