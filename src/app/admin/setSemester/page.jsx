import SemesterSelection from "@/components/admin-base/set-semester/setSemester";
import { cookies } from "next/headers";

export default function Page(){
  const cookieStore = cookies();
  return <SemesterSelection cookies={cookieStore}/>
};