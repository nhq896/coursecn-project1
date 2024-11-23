import { styles } from "@/app/styles/style";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({ courseInfo, setCourseInfo, active, setActive }) => {
  const [dragging, setDragging] = useState(false);
  const { data } = useGetHeroDataQuery("Categories", {});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data) {
      setCategories(data.layout?.categories);
    }
  }, [data]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="m-auto mt-24 w-[80%]">
      <form onSubmit={handleSubmit} className={`${styles.label}`}>
        <div>
          <label htmlFor="">Tên khóa học</label>
          <input
            type="name"
            name=""
            required
            value={courseInfo.name}
            onChange={(e: any) => setCourseInfo({ ...courseInfo, name: e.target.value })}
            id="name"
            placeholder="Tên khóa học"
            className={` ${styles.input}`}
          />
        </div>
        <br />
        <div className="mb-5">
          <label className={`${styles.label}`}>Mô tả khóa học</label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={8}
            placeholder="Mô tả khóa học..."
            className={`${styles.input} !h-min !py-2`}
            value={courseInfo.description}
            onChange={(e: any) => setCourseInfo({ ...courseInfo, description: e.target.value })}
          ></textarea>
        </div>
        <br />
        <div className="flex w-full justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`}>Giá khóa học</label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.price}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, price: e.target.value })}
              id="price"
              placeholder="100000"
              className={` ${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>Giá dự kiến (tùy chọn)</label>
            <input
              type="number"
              name=""
              value={courseInfo.estimatedPrice}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              id="price"
              placeholder="79000"
              className={` ${styles.input}`}
            />
          </div>
        </div>
        <br />
        <div className="flex w-full justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`} htmlFor="email">
              Tags khóa học
            </label>
            <input
              type="text"
              required
              name=""
              value={courseInfo.tags}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, tags: e.target.value })}
              id="tags"
              placeholder="tag1,tag2,tag3..."
              className={` ${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>Danh mục khóa học</label>
            <select
              name=""
              id=""
              className={`${styles.input}`}
              value={courseInfo.category}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, categories: e.target.value })}
            >
              <option value="">Chọn danh mục</option>
              {categories &&
                categories.map((item: any) => (
                  <option value={item.title} key={item._id}>
                    {item.title}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <br />
        <div className="flex w-full justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`}>Mức độ</label>
            <input
              type="text"
              name=""
              value={courseInfo.level}
              required
              onChange={(e: any) => setCourseInfo({ ...courseInfo, level: e.target.value })}
              id="level"
              placeholder="Bắt đầu/Trung bình/Nâng cao"
              className={` ${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label className={`${styles.label} w-[50%]`}>Link demo</label>
            <input
              type="text"
              name=""
              required
              value={courseInfo.demoUrl}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, demoUrl: e.target.value })}
              id="demoUrl"
              placeholder="Link demo"
              className={` ${styles.input}`}
            />
          </div>
        </div>
        <br />
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`flex min-h-[10vh] w-full items-center justify-center border border-[#00000026] p-3 dark:border-white ${
              dragging ? "bg-blue-500" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <img src={courseInfo.thumbnail} alt="" className="max-h-full w-full object-cover" />
            ) : (
              <span className="text-black dark:text-white">
                Kéo và thả hình ảnh thumbnail vào đây hoặc nhấn để chọn ảnh
              </span>
            )}
          </label>
        </div>
        <br />
        <div className="flex w-full items-center justify-end">
          <input
            type="submit"
            value="Tiếp theo"
            className="mt-8 h-[40px] w-full cursor-pointer rounded bg-[#37a39a] text-center text-[#fff] 800px:w-[180px]"
          />
        </div>
        <br />
        <br />
      </form>
    </div>
  );
};

export default CourseInformation;
