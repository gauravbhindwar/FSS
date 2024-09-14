import { cookies } from "next/headers";
import VerifyEmail from "../../components/Base/pass-reset/passReset";

export default function VerifyEmailPage() {
  const cookieStore = cookies();
  return <VerifyEmail cookies={cookieStore} />;
}