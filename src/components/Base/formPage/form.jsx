"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectForm from "@/components/Base/SelectForm";
import Loader from "@/app/verify-email/loader";
import { useRouter } from "next/navigation";

const FormPage = (props) => {
  const user = props.user;
  const admin = props.admin;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSemesterEven, setIsSemesterEven] = useState(true);
  const [activeSemester, setActiveSemester] = useState(2);
  const [semesters, setSemesters] = useState([]);
  const [allCourses, setAllCourses] = useState({});
  const [allSelectedCourses, setAllSelectedCourses] = useState({});

  const fetchIsSemesterEven = async () => {
    const response = await fetch("/api/form/isSemesterEven");
    const data = await response.json();
    const isEven = data.forTerm === "EVEN";
    setIsSemesterEven(isEven);
    return isEven;
  };

  const fetchCourses = async (isEven) => {
    try {
      const semestersToFetch = isEven ? [4, 6] : [3, 5, 7];
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

      // console.log("Course data fetched:", courseData);

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

  const goToPreviousSemester = () => {
    const currentIndex = semesters.indexOf(activeSemester);
    if (currentIndex > 0) {
      setActiveSemester(semesters[currentIndex - 1]);
    }
  };

  const goToNextSemester = () => {
    const currentIndex = semesters.indexOf(activeSemester);
    if (currentIndex < semesters.length - 1) {
      setActiveSemester(semesters[currentIndex + 1]);
    }
  };

  if (loading) {
    if (admin?.value || user?.value) {
    }
    return <Loader />;
  }

  return (
    <div className="p-5 max-sm:p-0 bg-slate-400 max-w-[100vw] h-[100%]">
      <form onSubmit={handleSubmit}>
        <Tabs
          defaultValue={`${semesters[0]} Semester`}
          className="w-[100%] bg-slate-300 p-4 max-sm:p-2 rounded-lg"
          value={`${activeSemester} Semester`}
          onValueChange={(value) => {
            const semester = parseInt(value.split(" ")[0], 10);
            setActiveSemester(semester);
          }}
        >
          <TabsList className="w-[100%] bg-slate-200 py-1.5 h-[fit-content]">
            {semesters.map((semester) => (
              <TabsTrigger
                key={semester}
                value={`${semester} Semester`}
                className="w-1/4"
              >
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

        <div className="flex justify-between mt-4 max-md:p-4">
          {/* Conditionally render "Previous" button except on the first tab */}
          {activeSemester !== semesters[0] ? (
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:scale-110 transition-all hover:bg-blue-600 active:scale-90 active:bg-blue-700"
              onClick={goToPreviousSemester}
            >
              Previous
            </button>
          ) :
          (
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:scale-110 transition-all hover:bg-gray-600 active:scale-90 active:bg-gray-700"
              onClick={()=>{
                router.push("/dashboard")
              }}
            >
              Close
            </button>
          ) }

          {/* Conditionally render "Next" button or "Submit" */}
          <div className="ml-auto">
            {activeSemester !== semesters[semesters.length - 1] ? (
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:scale-110 transition-all hover:bg-blue-600 active:scale-90 active:bg-blue-700"
                onClick={goToNextSemester}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:scale-110 transition-all hover:bg-blue-600 active:scale-90 active:bg-blue-700"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormPage;
