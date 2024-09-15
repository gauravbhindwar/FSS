import Profile from "../../../components/user-base/Profile";
import { cookies } from "next/headers";

export function ProfilePage() {
  const cookieStore = cookies();
  return (
    <div>
      <Profile cookies={cookieStore} />
    </div>
  );
}

export default ProfilePage;
