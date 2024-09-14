import CourseForm from "@/components/admin-base/course-form/CourseForm";
import { cookies } from "next/headers";

export default function AddCoursePage() {
  const cookieStore = cookies();
  return (
    <div>
      <CourseForm cookies={cookieStore} />
    </div>
  );
}
