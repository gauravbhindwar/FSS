import FormDownloadPage from "@/components/admin-base/print-form/printForm.jsx";
import { cookies } from "next/headers";

export default function Page(){
  const cookieStore = cookies();
  return <FormDownloadPage cookies={cookieStore}/>
};