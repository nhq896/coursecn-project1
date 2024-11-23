import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import { format, register } from "timeago.js";
import vi from "timeago.js/lib/lang/vi";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineStar } from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import Ratings from "@/app/utils/Ratings";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

register("vi", vi);

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
};

const CourseContentMedia = ({ data, id, activeVideo, setActiveVideo, user, refetch }: Props) => {
  const [activeBar, setactiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);

  const [addNewQuestion, { isSuccess, error, isLoading: questionCreationLoading }] =
    useAddNewQuestionMutation();
  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [
    addAnswerInQuestion,
    { isSuccess: answerSuccess, error: answerError, isLoading: answerCreationLoading },
  ] = useAddAnswerInQuestionMutation();
  const course = courseData?.course;
  const [
    addReviewInCourse,
    { isSuccess: reviewSuccess, error: reviewError, isLoading: reviewCreationLoading },
  ] = useAddReviewInCourseMutation();

  const [
    addReplyInReview,
    { isSuccess: replySuccess, error: replyError, isLoading: replyCreationLoading },
  ] = useAddReplyInReviewMutation();

  const isReviewExists = course?.reviews?.find((item: any) => item.user._id === user._id);

  const handleQuestion = () => {
    if (question.length === 0) {
      toast.error("Bình luận không thể để trống!");
    } else {
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]._id,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();
      socketId.emit("notification", {
        title: `Bình luận mới`,
        message: `Bạn có một bình luận mới trong ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (answerSuccess) {
      setAnswer("");
      refetch();
      if (user.role !== "admin") {
        socketId.emit("notification", {
          title: `Bình luận mới`,
          message: `Bạn có một bình luận mới trong ${data[activeVideo].title}`,
          userId: user._id,
        });
      }
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
    if (answerError) {
      if ("data" in answerError) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
    if (reviewSuccess) {
      setReview("");
      setRating(1);
      courseRefetch();
      socketId.emit("notification", {
        title: `Bình luận mới`,
        message: `Bạn có một bình luận mới trong ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (reviewError) {
      if ("data" in reviewError) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
    if (replySuccess) {
      setReply("");
      courseRefetch();
    }
    if (replyError) {
      if ("data" in replyError) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [
    isSuccess,
    error,
    answerSuccess,
    answerError,
    reviewSuccess,
    reviewError,
    replySuccess,
    replyError,
  ]);

  const handleAnswerSubmit = () => {
    addAnswerInQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId: questionId,
    });
  };

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Đánh giá không thể để trống!");
    } else {
      addReviewInCourse({ review, rating, courseId: id });
    }
  };

  const handleReviewReplySubmit = () => {
    if (!replyCreationLoading) {
      if (reply === "") {
        toast.error("Phản hồi không thể để trống!");
      } else {
        addReplyInReview({ comment: reply, courseId: id, reviewId });
      }
    }
  };

  return (
    <div className="m-auto w-[95%] py-4 800px:w-[86%]">
      <CoursePlayer title={data[activeVideo]?.title} videoUrl={data[activeVideo]?.videoUrl} />
      <div className="my-3 flex w-full items-center justify-between">
        <div
          className={`${styles.button} !min-h-[40px] !w-[unset] !py-[unset] text-white ${
            activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() => setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)}
        >
          <AiOutlineArrowLeft className="mr-2" />
          Bài học trước
        </div>
        <div
          className={`${styles.button} !min-h-[40px] !w-[unset] !py-[unset] text-white ${
            data.length - 1 === activeVideo && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(data && data.length - 1 === activeVideo ? activeVideo : activeVideo + 1)
          }
        >
          Bài học tiếp theo
          <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>
      <h1 className="pt-2 text-[25px] font-[600] text-black dark:text-white">
        {data[activeVideo].title}
      </h1>
      <br />
      <div className="flex w-full items-center justify-between rounded bg-slate-500 bg-opacity-20 p-4 shadow-inner shadow-[bg-slate-700] backdrop-blur">
        {["Tổng quan", "Tài liệu", "Bình luận", "Đánh giá"].map((text, index) => (
          <h5
            key={index}
            className={`cursor-pointer 800px:text-[20px] ${
              activeBar === index ? "text-red-500" : "text-black dark:text-white"
            }`}
            onClick={() => setactiveBar(index)}
          >
            {text}
          </h5>
        ))}
      </div>
      <br />
      {activeBar === 0 && (
        <p className="mb-3 whitespace-pre-line text-[18px] text-black dark:text-white">
          {data[activeVideo]?.description}
        </p>
      )}

      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((item: any, index: number) => (
            <div className="mb-5" key={index}>
              <h2 className="text-black dark:text-white 800px:inline-block 800px:text-[20px]">
                {item.title && item.title + " :"}
              </h2>
              <a
                className="inline-block text-[#4395c4] 800px:pl-2 800px:text-[20px]"
                href={item.url}
              >
                {item.url}
              </a>
            </div>
          ))}
        </div>
      )}

      {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={
                user.avatar
                  ? user.avatar.url
                  : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
              }
              width={50}
              height={50}
              alt=""
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
            <textarea
              name=""
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              id=""
              cols={40}
              rows={5}
              placeholder="Viết bình luận của bạn..."
              className="ml-3 w-[90%] rounded border border-[#0000001d] bg-transparent p-2 text-black outline-none dark:border-[#ffffff57] dark:text-white 800px:w-full 800px:text-[18px]"
            ></textarea>
          </div>
          <div className="flex w-full justify-end">
            <div
              className={`${styles.button} mt-5 !h-[40px] !w-[120px] text-[18px] ${
                questionCreationLoading && "cursor-not-allowed"
              }`}
              onClick={questionCreationLoading ? () => {} : handleQuestion}
            >
              Gửi
            </div>
          </div>
          <br />
          <br />
          <div className="h-[1px] w-full bg-[#ffffff3b]"></div>
          <div>
            <CommentReply
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              user={user}
              questionId={questionId}
              setQuestionId={setQuestionId}
              answerCreationLoading={answerCreationLoading}
            />
          </div>
        </>
      )}

      {activeBar === 3 && (
        <div className="w-full">
          <>
            {!isReviewExists && (
              <>
                <div className="flex w-full">
                  <Image
                    src={
                      user.avatar
                        ? user.avatar.url
                        : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="h-[50px] w-[50px] rounded-full object-cover"
                  />
                  <div className="w-full">
                    <h5 className="pl-3 text-[20px] font-[500] text-black dark:text-white">
                      Đánh giá <span className="text-red-500">*</span>
                    </h5>
                    <div className="ml-2 flex w-full pb-3">
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      name=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      id=""
                      cols={40}
                      rows={5}
                      placeholder="Viết đánh giá của bạn..."
                      className="w-[95%] rounded border border-[#00000027] bg-transparent p-2 text-[18px] text-black outline-none dark:border-[#ffffff57] dark:text-white 800px:ml-3 800px:w-full"
                    ></textarea>
                  </div>
                </div>
                <div className="flex w-full justify-end">
                  <div
                    className={`${
                      styles.button
                    } mr-2 mt-5 !h-[40px] !w-[120px] text-[18px] 800px:mr-0 ${
                      reviewCreationLoading && "cursor-no-drop"
                    }`}
                    onClick={reviewCreationLoading ? () => {} : handleReviewSubmit}
                  >
                    Gửi
                  </div>
                </div>
              </>
            )}
            <br />
            <div className="h-[1px] w-full bg-[#ffffff3b]"></div>
            <div className="w-full">
              {(course?.reviews && [...course.reviews].reverse())?.map(
                (item: any, index: number) => {
                  return (
                    <div className="my-5 w-full text-black dark:text-white" key={index}>
                      <div className="flex w-full">
                        <div>
                          <Image
                            src={
                              item.user.avatar
                                ? item.user.avatar.url
                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="h-[50px] w-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-2">
                          <h1 className="text-[18px]">{item?.user.name}</h1>
                          <Ratings rating={item.rating} />
                          <p>{item.comment}</p>
                          <small className="text-[#0000009e] dark:text-[#ffffff83]">
                            {format(item.createdAt, "vi")} •
                          </small>
                        </div>
                      </div>
                      {user.role === "admin" && item.commentReplies.length === 0 && (
                        <span
                          className={`${styles.label} !ml-10 cursor-pointer`}
                          onClick={() => {
                            setIsReviewReply(true);
                            setReviewId(item._id);
                          }}
                        >
                          Thêm phản hồi
                        </span>
                      )}

                      {isReviewReply && reviewId === item._id && (
                        <div className="relative flex w-full">
                          <input
                            type="text"
                            placeholder="Nhập phản hồi của bạn..."
                            value={reply}
                            onChange={(e: any) => setReply(e.target.value)}
                            className="mt-2 block w-[95%] border-b border-[#000] bg-transparent p-[5px] outline-none dark:border-[#fff] 800px:ml-12"
                          />
                          <button
                            type="submit"
                            className="absolute bottom-1 right-0"
                            onClick={handleReviewReplySubmit}
                          >
                            Gửi
                          </button>
                        </div>
                      )}

                      {item.commentReplies.map((i: any, index: number) => (
                        <div className="my-5 flex w-full 800px:ml-16" key={index}>
                          <div className="h-[50px] w-[50px]">
                            <Image
                              src={
                                i.user.avatar
                                  ? i.user.avatar.url
                                  : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                              }
                              width={50}
                              height={50}
                              alt=""
                              className="h-[50px] w-[50px] rounded-full object-cover"
                            />
                          </div>
                          <div className="pl-2">
                            <div className="flex items-center">
                              <h5 className="text-[20px]">{i.user.name}</h5>{" "}
                              <VscVerifiedFilled className="ml-2 text-[20px] text-[#0095F6]" />
                            </div>
                            <p>{i.comment}</p>
                            <small className="text-[#ffffff83]">
                              {format(i.createdAt, "vi")} •
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
              )}
            </div>
          </>
        </div>
      )}
    </div>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  answerCreationLoading,
}: any) => {
  return (
    <>
      <div className="my-3 w-full">
        {data[activeVideo].questions.map((item: any, index: any) => (
          <CommentItem
            key={index}
            data={data}
            activeVideo={activeVideo}
            item={item}
            index={index}
            answer={answer}
            setAnswer={setAnswer}
            questionId={questionId}
            setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
            answerCreationLoading={answerCreationLoading}
          />
        ))}
      </div>
    </>
  );
};

const CommentItem = ({
  questionId,
  setQuestionId,
  item,
  answer,
  setAnswer,
  handleAnswerSubmit,
  answerCreationLoading,
}: any) => {
  const [replyActive, setreplyActive] = useState(false);
  return (
    <>
      <div className="my-4">
        <div className="mb-2 flex">
          <div>
            <Image
              src={
                item.user.avatar
                  ? item.user.avatar.url
                  : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
              }
              width={50}
              height={50}
              alt=""
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
          </div>
          <div className="pl-3 text-black dark:text-white">
            <h5 className="text-[20px]">{item?.user.name}</h5>
            <p>{item?.question}</p>
            <small className="text-[#000000b8] dark:text-[#ffffff83]">
              {!item.createdAt ? "" : format(item?.createdAt, "vi")} •
            </small>
          </div>
        </div>
        <div className="flex w-full">
          <span
            className="mr-2 cursor-pointer text-[#000000b8] dark:text-[#ffffff83] 800px:pl-16"
            onClick={() => {
              setreplyActive(!replyActive);
              setQuestionId(item._id);
            }}
          >
            {!replyActive
              ? item.questionReplies.length !== 0
                ? "Tất cả phản hồi"
                : "Thêm phản hồi"
              : "Ẩn phản hồi"}
          </span>
          <BiMessage size={20} className="cursor-pointer text-[#000000b8] dark:text-[#ffffff83]" />
          <span className="mt-[-4px] cursor-pointer pl-1 text-[#000000b8] dark:text-[#ffffff83]">
            {item.questionReplies.length}
          </span>
        </div>

        {replyActive && questionId === item._id && (
          <>
            {item.questionReplies.map((item: any) => (
              <div
                className="my-5 flex w-full text-black dark:text-white 800px:ml-16"
                key={item._id}
              >
                <div>
                  <Image
                    src={
                      item.user.avatar
                        ? item.user.avatar.url
                        : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="h-[50px] w-[50px] rounded-full object-cover"
                  />
                </div>
                <div className="pl-3">
                  <div className="flex items-center">
                    <h5 className="text-[20px]">{item.user.name}</h5>{" "}
                    {item.user.role === "admin" && (
                      <VscVerifiedFilled className="ml-2 text-[20px] text-[#0095F6]" />
                    )}
                  </div>
                  <p>{item.answer}</p>
                  <small className="text-[#ffffff83]">{format(item.createdAt, "vi")} •</small>
                </div>
              </div>
            ))}
            <>
              <div className="relative flex w-full text-black dark:text-white">
                <input
                  type="text"
                  placeholder="Nhập câu trả lời của bạn..."
                  value={answer}
                  onChange={(e: any) => setAnswer(e.target.value)}
                  className={`mt-2 block w-[95%] border-b border-[#00000027] bg-transparent p-[5px] text-black outline-none dark:border-[#fff] dark:text-white 800px:ml-12 ${
                    answer === "" || (answerCreationLoading && "cursor-not-allowed")
                  }`}
                />
                <button
                  type="submit"
                  className="absolute bottom-1 right-0"
                  onClick={handleAnswerSubmit}
                  disabled={answer === "" || answerCreationLoading}
                >
                  Gửi
                </button>
              </div>
              <br />
            </>
          </>
        )}
      </div>
    </>
  );
};

export default CourseContentMedia;
