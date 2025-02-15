"use client";
import { RadioGroup, RadioGroupItem, Label } from "@/components/ui/radio-group";

type Course = {
  title: string;
  description?: string;
  courseType?: string;
  courseCredit?: string;
};

type SemesterCourses = {
  labCourses: Course[];
  theoryCourses: Course[];
};

type SelectedCourses = {
  labCourses: string;
  theoryCourses: string;
};

type SelectFormProps = {
  semester: number;
  courses: SemesterCourses;
  selectedCourses: SelectedCourses;
  onCourseChange: (semester: number, selectedCourses: SelectedCourses) => void;
};

const SelectForm: React.FC<SelectFormProps> = ({
  semester,
  courses = { labCourses: [], theoryCourses: [] }, // Default empty courses
  selectedCourses,
  onCourseChange,
}) => {
  const { labCourses = [], theoryCourses = [] } = courses; // Default empty arrays
  console.log(labCourses, theoryCourses);
  const handleCourseChange = (
    type: "labCourses" | "theoryCourses",
    value: string
  ) => {
    onCourseChange(semester, {
      ...selectedCourses,
      [type]: value,
    });
  };

  return (
    <div>
      <RadioGroup
        value={selectedCourses.labCourses}
        onValueChange={(value) => handleCourseChange("labCourses", value)}>
        <div className="">
          <h3 className="font-bold text-lg">Lab Courses</h3>
          {labCourses.length > 0 ? (
            labCourses.map((course) => (
              <Label
                htmlFor={`lab-${course.title}`}
                className=""
                key={course.title}>
                <div
                  className={`flex items-center space-x-2 rounded-xl cursor-pointer p-4 my-2 ${selectedCourses.labCourses === course.title
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-slate-100 hover:bg-slate-200"
                    }`}>
                  <RadioGroupItem
                    value={course.title}
                    id={`lab-${course.title}`}
                  />
                  <div className="cursor-pointer w-[90%]">
                    <h1 className="font-bold text-zinc-800 text-lg max-md:text-base inline-block">
                      {course.title}
                    </h1>{" "}
                    <h2 className="inline-block text-base max-md:text-sm text-zinc-700 font-semibold">
                      ({course?.courseType}) Course Credit: {course?.courseCredit}
                    </h2>
                    <p className="text-zinc-700 text-sm max-md:text-xs">
                      {course?.description}
                    </p>
                  </div>
                </div>
              </Label>
            ))
          ) : (
            <p>No lab courses available.</p>
          )}
        </div>
      </RadioGroup>

      <RadioGroup
        value={selectedCourses.theoryCourses}
        onValueChange={(value) => handleCourseChange("theoryCourses", value)}>
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Theory Courses</h3>
          {theoryCourses.length > 0 ? (
            theoryCourses.map((course) => (
              <Label
                htmlFor={`theory-${course.title}`}
                className=""
                key={course.title}>
                <div
                  className={`flex items-center space-x-2 rounded-xl cursor-pointer p-4 my-2 ${selectedCourses.theoryCourses === course.title
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-slate-100 hover:bg-slate-200"
                    }`}>
                  <RadioGroupItem
                    value={course.title}
                    id={`theory-${course.title}`}
                  />
                  <div className="cursor-pointer w-[90%]">
                    <h1 className="font-bold text-zinc-800 text-lg max-md:text-base inline-block">
                      {course.title}
                    </h1>{" "}
                    <h2 className="inline-block text-base max-md:text-sm text-zinc-700 font-semibold">
                      ({course?.courseType}) Course Credit: {course?.courseCredit}
                    </h2>
                    <p className="text-zinc-700 text-sm max-md:text-xs">
                      {course?.description}
                    </p>
                  </div>
                </div>
              </Label>
            ))
          ) : (
            <p>No theory courses available.</p>
          )}
        </div>
      </RadioGroup>
    </div>
  );
};

export default SelectForm;