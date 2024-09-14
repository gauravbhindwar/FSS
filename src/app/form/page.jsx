import { cookies } from "next/headers";
import FormPage from "@/components/Base/formPage/form";
import { Form } from "@/lib/dbModels/dbModels";

export default function Page() {
  const cookieStore = cookies();
  const user = cookieStore.get("user");
  const admin = cookieStore.get("admin");
  return <FormPage user={user} admin={admin} />;
}
