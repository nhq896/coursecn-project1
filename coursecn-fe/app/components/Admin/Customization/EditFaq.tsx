import { styles } from "@/app/styles/style";
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import Loader from "../../Loader/Loader";

type Props = {};

const EditFaq = (props: Props) => {
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] = useEditLayoutMutation();

  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout?.faq);
    }
    if (layoutSuccess) {
      toast.success("FAQ updated successfully");
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, layoutSuccess, error]);

  const toggleQuestion = (id: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  // Function to check if the FAQ arrays are unchanged
  const areQuestionsUnchanged = (originalQuestions: any[], newQuestions: any[]) => {
    return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
  };

  const isAnyQuestionEmpty = (questions: any[]) => {
    return questions.some((q) => q.question === "" || q.answer === "");
  };

  const handleEdit = async () => {
    if (!areQuestionsUnchanged(data.layout?.faq, questions) && !isAnyQuestionEmpty(questions)) {
      await editLayout({
        type: "FAQ",
        faq: questions,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="m-auto mt-[120px] w-[90%] 800px:w-[80%]">
          <div className="mt-12">
            <dl className="space-y-8">
              {questions.map((q: any) => (
                <div
                  key={q._id}
                  className={`${q._id !== questions[0]?._id && "border-t"} border-gray-200 pt-6`}
                >
                  <dt className="text-lg">
                    <button
                      className="flex w-full items-start justify-between text-left text-black focus:outline-none dark:text-white"
                      onClick={() => toggleQuestion(q._id)}
                    >
                      <input
                        className={`${styles.input} border-none`}
                        value={q.question}
                        onChange={(e: any) => handleQuestionChange(q._id, e.target.value)}
                        placeholder={"Thêm câu hỏi..."}
                      />

                      <span className="ml-6 flex-shrink-0">
                        {q.active ? (
                          <HiMinus className="h-6 w-6" />
                        ) : (
                          <HiPlus className="h-6 w-6" />
                        )}
                      </span>
                    </button>
                  </dt>
                  {q.active && (
                    <dd className="mt-2 pr-12">
                      <input
                        className={`${styles.input} border-none`}
                        value={q.answer}
                        onChange={(e: any) => handleAnswerChange(q._id, e.target.value)}
                        placeholder={"Thêm câu trả lời..."}
                      />
                      <span className="ml-6 flex-shrink-0">
                        <AiOutlineDelete
                          className="cursor-pointer text-[18px] text-black dark:text-white"
                          onClick={() => {
                            setQuestions((prevQuestions) =>
                              prevQuestions.filter((item) => item._id !== q._id)
                            );
                          }}
                        />
                      </span>
                    </dd>
                  )}
                </div>
              ))}
            </dl>
            <br />
            <br />
            <IoMdAddCircleOutline
              className="cursor-pointer text-[25px] text-black dark:text-white"
              onClick={newFaqHandler}
            />
          </div>

          <div
            className={`${
              styles.button
            } !h-[40px] !min-h-[40px] !w-[100px] bg-[#cccccc34] text-black dark:text-white ${
              areQuestionsUnchanged(data.layout?.faq, questions) || isAnyQuestionEmpty(questions)
                ? "!cursor-not-allowed"
                : "!cursor-pointer !bg-[#42d383]"
            } fixed bottom-12 right-12 !rounded`}
            onClick={
              areQuestionsUnchanged(data.layout?.faq, questions) || isAnyQuestionEmpty(questions)
                ? () => null
                : handleEdit
            }
          >
            Lưu
          </div>
        </div>
      )}
    </>
  );
};

export default EditFaq;
