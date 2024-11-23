import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";

type Props = {};

const Courses = (props: Props) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    setCourses(data?.courses);
  }, [data]);

  return (
    <div>
      <div className={`m-auto mt-4 w-[90%] 800px:w-[80%]`}>
        <h1 className="text-center text-2xl font-bold tracking-tight text-black dark:text-white sm:text-3xl 800px:!leading-[60px] lg:text-4xl">
          <span className="text-gradient">Khóa học</span> của chúng tôi
        </h1>
        <br />
        <br />
        <div className="mb-12 grid grid-cols-1 gap-[20px] border-0 md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px]">
          {courses &&
            courses.map((item: any, index: number) => <CourseCard item={item} key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default Courses;
