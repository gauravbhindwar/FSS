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
  const [activeSemester, setActiveSemester] = useState(2);
  const [semesters, setSemesters] = useState([]);
  const [allCourses, setAllCourses] = useState({});
  const [allSelectedCourses, setAllSelectedCourses] = useState({});

  const fetchIsSemesterEven = async () => {
    try {
      const response = await axios.get("/api/form/isSemesterEven");
      const isEven = response.data.forTerm === "EVEN";
      setIsSemesterEven(isEven);
      return isEven;
    } catch (error) {
      console.error("Error fetching semester type:", error);
      return true; // Default to even semester if there's an error
    }
  };

  const fetchCourses = async (isEven) => {
    try {
      const semestersToFetch = isEven ? [2, 4, 6, 8] : [1, 3, 5, 7];
      setSemesters(semestersToFetch);
      setActiveSemester(semestersToFetch[0]);

      const courseData = await Promise.all(
        semestersToFetch.flatMap((semester) => [
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

      const coursesBySemester = semestersToFetch.reduce(
        (acc, semester, index) => {
          const labCourses = courseData[index * 2]?.data?.courses || [];
          const theoryCourses = courseData[index * 2 + 1]?.data?.courses || [];
          acc[semester] = {
            labCourses,
            theoryCourses,
          };
          return acc;
        },
        {}
      );

      setAllCourses(coursesBySemester);

      // Initialize allSelectedCourses
      const initialSelectedCourses = semestersToFetch.reduce(
        (acc, semester) => {
          acc[semester] = { labCourses: "", theoryCourses: "" };
          return acc;
        },
        {}
      );
      setAllSelectedCourses(initialSelectedCourses);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const isEven = await fetchIsSemesterEven();
      await fetchCourses(isEven);
    };
    initializeData();
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
        activeSemester,
      });

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
          defaultValue={`${semesters[0]} Semester`}
          className="w-[100%] bg-slate-300 p-4 rounded-lg"
          onValueChange={(value) => {
            const semester = parseInt(value.split(" ")[0], 10);
            setActiveSemester(semester);
          }}>
          <TabsList className="w-[100%]">
            {semesters.map((semester) => (
              <TabsTrigger
                key={semester}
                value={`${semester} Semester`}
                className="w-1/4">
                {semester} Semester
              </TabsTrigger>
            ))}
          </TabsList>

          {semesters.map((semester) => (
            <TabsContent key={semester} value={`${semester} Semester`}>
              <SelectForm
                semester={semester}
                courses={
                  allCourses[semester] || { labCourses: [], theoryCourses: [] }
                }
                selectedCourses={allSelectedCourses[semester]}
                onCourseChange={handleCourseChange}
              />
            </TabsContent>
          ))}
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
                onClick={handleSubmit}>
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
