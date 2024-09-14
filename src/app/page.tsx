import Loader from "@/components/Base/Loader";
import Header from "@/components/Base/Header/Header";
import { cookies } from "next/headers";

export default function Home() {
  const cookieStore = cookies();
  return (
    <>
      <Header />
      <Loader cookies={cookieStore} />
    </>
  );
}
