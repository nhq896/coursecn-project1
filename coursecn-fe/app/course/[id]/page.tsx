"use client";

import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

interface CoursePageProps {
  params: any;
}

const CoursePage: React.FC<CoursePageProps> = ({ params }) => {
  return (
    <div>
      <CourseDetailsPage id={params.id} />
    </div>
  );
};

export default CoursePage;
