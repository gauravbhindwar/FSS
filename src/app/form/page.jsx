"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectForm from "@/components/Base/SelectForm";
import Loader from "../verify-email/loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const FormPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSemesterEven, setIsSemesterEven] = useState(true);
  const [allCourses, setAllCourses] = useState({
    3: { labCourses: [], theoryCourses: [] },
    5: { labCourses: [], theoryCourses: [] },
    7: { labCourses: [], theoryCourses: [] },
  });
  const [allSelectedCourses, setAllSelectedCourses] = useState({
    3: { labCourses: "", theoryCourses: "" },
    5: { labCourses: "", theoryCourses: "" },
    7: { labCourses: "", theoryCourses: "" },
  });
  const [activeSemester, setActiveSemester] = useState(3);

  const fetchCourses = async () => {
    try {
      const semesters = [3, 5, 7];
      const courseData = await Promise.all(
        semesters.flatMap((semester) => [
          axios.post("/api/courses/getCourse", {
            courseClassification: "LAB",
            forSemester: semester,
          }),
          axios.post("/api/courses/getCourse", {
            courseClassification: "THEORY",
            forSemester: semester,
          }),
        ])
      );
      if (semesters[0] % 2 === 0) {
        setIsSemesterEven(true);
      } else {
        setIsSemesterEven(false);
      }

      const coursesBySemester = semesters.reduce((acc, semester, index) => {
        const labCourses = courseData[index * 2]?.data?.courses || [];
        const theoryCourses = courseData[index * 2 + 1]?.data?.courses || [];
        acc[semester] = {
          labCourses,
          theoryCourses,
        };
        setLoading(false);
        return acc;
      }, {});

      setAllCourses(coursesBySemester);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseChange = (semester, selectedCourses) => {
    setAllSelectedCourses((prevCourses) => ({
      ...prevCourses,
      [semester]: selectedCourses,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all required fields are filled for all semesters
    const allFieldsFilled = Object.values(allSelectedCourses).every(
      (courses) => courses.labCourses !== "" && courses.theoryCourses !== ""
    );

    if (!allFieldsFilled) {
      console.error("Please fill all required fields for all semesters.");
      return;
    }

    try {
      const response = await axios.post("/api/form", {
        allSelectedCourses,
        isEven: isSemesterEven,
      });

      // setMessage("FormSubmitted Successfully");
      <Loader />;
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="sm:p-10 bg-slate-400 w-[100vw] h-[100%]">
      <form onSubmit={handleSubmit}>
        <Tabs
          defaultValue="3rd Semester"
          className="w-[100%] bg-slate-300 p-4 rounded-lg"
          onValueChange={(value) => {
            const semester = parseInt(value.split(" ")[0], 10);
            setActiveSemester(semester);
          }}
        >
          <TabsList className="w-[100%]">
            <TabsTrigger value="3rd Semester" className="w-1/3">
              3rd Semester
            </TabsTrigger>
            <TabsTrigger value="5th Semester" className="w-1/3">
              5th Semester
            </TabsTrigger>
            <TabsTrigger value="7th Semester" className="w-1/3">
              7th Semester
            </TabsTrigger>
          </TabsList>

          <TabsContent value="3rd Semester">
            <SelectForm
              semester={3}
              courses={allCourses[3] || { labCourses: [], theoryCourses: [] }}
              selectedCourses={allSelectedCourses[3]}
              onCourseChange={handleCourseChange}
            />
          </TabsContent>
          <TabsContent value="5th Semester">
            <SelectForm
              semester={5}
              courses={allCourses[5] || { labCourses: [], theoryCourses: [] }}
              selectedCourses={allSelectedCourses[5]}
              onCourseChange={handleCourseChange}
            />
          </TabsContent>
          <TabsContent value="7th Semester">
            <SelectForm
              semester={7}
              courses={allCourses[7] || { labCourses: [], theoryCourses: [] }}
              selectedCourses={allSelectedCourses[7]}
              onCourseChange={handleCourseChange}
            />
          </TabsContent>
        </Tabs>

        <AlertDialog>
          <AlertDialogTrigger className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Submit All Courses
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure to submit your form?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className=" bg-red-600 text-white rounded">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className=" bg-green-500 text-white rounded"
                onClick={handleSubmit}
              >
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
  );
};

export default FormPage;
