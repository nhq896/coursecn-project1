import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

type Props = {
  data: any;
  activeVideo?: number;
  setActiveVideo?: any;
  isDemo?: boolean;
};

const CourseContentList: FC<Props> = (props) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set<string>());

  // Find unique video sections
  const videoSections: string[] = Array.from(
    new Set<string>(props.data?.map((item: any) => item.videoSection))
  );

  let totalCount: number = 0; // Total count of videos from previous sections

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);
    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }
    setVisibleSections(newVisibleSections);
  };

  return (
    <div
      className={`mt-[15px] w-full ${!props.isDemo && "sticky left-0 top-24 z-30 ml-[-30px] min-h-screen"}`}
    >
      {videoSections.map((section: string, sectionIndex: number) => {
        const isSectionVisible = visibleSections.has(section);

        // Filter videos by section
        const sectionVideos: any[] = props.data.filter(
          (item: any) => item.videoSection === section
        );

        const sectionVideoCount: number = sectionVideos.length; // Number of videos in the current section
        const sectionVideoLength: number = sectionVideos.reduce(
          (totalLength: number, item: any) => totalLength + item.videoLength,
          0
        );
        const sectionStartIndex: number = totalCount; // Start index of videos within the current section
        totalCount += sectionVideoCount; // Update the total count of videos

        const sectionContentHours: number = sectionVideoLength / 60;

        return (
          <div
            className={`${!props.isDemo && "border-b border-[#0000001c] pb-2 dark:border-[#ffffff8e]"}`}
            key={section}
          >
            <div className="flex w-full">
              {/* Render video section */}
              <div className="flex w-full items-center justify-between">
                <h2 className="text-[22px] text-black dark:text-white">{section}</h2>
                <button
                  className="mr-4 cursor-pointer text-black dark:text-white"
                  onClick={() => toggleSection(section)}
                >
                  {isSectionVisible ? <BsChevronUp size={20} /> : <BsChevronDown size={20} />}
                </button>
              </div>
            </div>
            <h5 className="text-black dark:text-white">
              {sectionVideoCount} bài học ·{" "}
              {sectionVideoLength < 60 ? sectionVideoLength : sectionContentHours.toFixed(2)}{" "}
              {sectionVideoLength > 60 ? "giờ" : "phút"}
            </h5>
            <br />
            {isSectionVisible && (
              <div className="w-full">
                {sectionVideos.map((item: any, index: number) => {
                  const videoIndex: number = sectionStartIndex + index; // Calculate the video index within the overall list
                  const contentLength: number = item.videoLength / 60;
                  return (
                    <div
                      className={`w-full ${
                        videoIndex === props.activeVideo ? "bg-slate-200 dark:bg-slate-800" : ""
                      } cursor-pointer p-2 transition-all`}
                      key={item._id}
                      onClick={() => (props.isDemo ? null : props?.setActiveVideo(videoIndex))}
                    >
                      <div className="flex items-start">
                        <div>
                          <MdOutlineOndemandVideo size={25} className="mr-2" color="#1cdada" />
                        </div>
                        <h1 className="inline-block break-words text-[18px] text-black dark:text-white">
                          {item.title}
                        </h1>
                      </div>
                      <h5 className="pl-8 text-black dark:text-white">
                        {item.videoLength > 60 ? contentLength.toFixed(2) : item.videoLength}{" "}
                        {item.videoLength > 60 ? "giờ" : "phút"}
                      </h5>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
