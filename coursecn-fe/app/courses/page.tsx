"use client";

import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

type CoursesPageProps = {};

const CoursesPage: React.FC<CoursesPageProps> = (props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setcourses] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (category === "All") {
      setcourses(data?.courses);
    }
    if (category !== "All") {
      setcourses(data?.courses.filter((item: any) => item.categories === category));
    }
    if (search) {
      setcourses(
        data?.courses.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [data, category, search]);

  const categories = categoriesData?.layout?.categories;

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} />
          <div className="m-auto min-h-[70vh] w-[95%] 800px:w-[85%]">
            <Heading
              title="Khóa học - coursecn"
              description="web description"
              keywords="coursecn"
            />
            <br />
            <div className="flex w-full flex-wrap items-center">
              <div
                className={`h-[35px] ${
                  category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                } m-3 flex cursor-pointer items-center justify-center rounded-[30px] px-3`}
                onClick={() => setCategory("All")}
              >
                Tất cả
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`h-[35px] ${
                        category === item.title ? "bg-[crimson]" : "bg-[#5050cb]"
                      } m-3 flex cursor-pointer items-center justify-center rounded-[30px] px-3`}
                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>
            {courses && courses.length === 0 && (
              <p className={`${styles.label} flex min-h-[50vh] items-center justify-center`}>
                {search
                  ? "Không tìm thấy khóa học!"
                  : "Không tìm thấy khóa học trong danh mục này. Vui lòng thử một danh mục khác!"}
              </p>
            )}
            <br />
            <br />
            <div className="mb-12 grid grid-cols-1 gap-[20px] border-0 md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px]">
              {courses &&
                courses.map((item: any, index: number) => <CourseCard item={item} key={index} />)}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default CoursesPage;
