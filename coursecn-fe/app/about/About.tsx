import { styles } from "../styles/style";

const About = () => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        Giới thiệu về <span className="text-gradient">coursecn</span>
      </h1>

      <br />
      <div className="m-auto w-[95%] 800px:w-[85%]">
        <p className="font-Poppins text-[18px]">
          Chào mừng bạn đến với coursecn - nền tảng học tập trực tuyến được thiết kế để đồng hành
          cùng hành trình phát triển của bạn. Chúng tôi tự hào mang đến một môi trường học tập chất
          lượng, nơi kiến thức và kỹ năng được truyền đạt một cách hiệu quả và dễ tiếp cận.
          <br />
          <br />
          Tại coursecn, chúng tôi hiểu rằng mỗi người học đều có những nhu cầu và mục tiêu riêng. Đó
          là lý do chúng tôi cung cấp đa dạng các khóa học. Mỗi khóa học được xây dựng tỉ mỉ với nội
          dung cập nhật, bài tập thực hành và các dự án thực tế.
          <br />
          <br />
          Điểm khác biệt của coursecn nằm ở phương pháp giảng dạy tương tác và cá nhân hóa. Học viên
          không chỉ được tiếp cận với video bài giảng chất lượng cao mà còn nhận được sự hỗ trợ trực
          tiếp từ đội ngũ giảng viên giàu kinh nghiệm. Chúng tôi tin rằng việc học không chỉ dừng
          lại ở việc tiếp thu kiến thức, mà còn là quá trình áp dụng và thực hành thực tế.
          <br />
          <br />
          Với cam kết mang đến trải nghiệm học tập tốt nhất, chúng tôi liên tục cập nhật và nâng cao
          chất lượng khóa học, đồng thời duy trì mức học phí hợp lý để đảm bảo mọi người đều có cơ
          hội tiếp cận với nền tảng giáo dục chất lượng cao.
          <br />
          <br />
          Hãy tham gia cùng coursecn ngay hôm nay để bắt đầu hành trình phát triển bản thân của bạn.
          Chúng tôi tin rằng với sự nỗ lực và định hướng đúng đắn, mỗi học viên đều có thể đạt được
          mục tiêu của mình và tiến xa hơn trong sự nghiệp.
        </p>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;
