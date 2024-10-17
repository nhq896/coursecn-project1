import { styles } from "../styles/style";

type PolicyProps = {};

const Policy: React.FC<PolicyProps> = (props) => {
  return (
    <>
      <div className={"m-auto w-[95%] px-3 py-2 text-black dark:text-white 800px:w-[92%]"}>
        <h1 className={`${styles.title} pt-2 !text-start`}>Chính sách của chúng tôi</h1>
        <ul style={{ listStyle: "unset", marginLeft: "15px" }}>
          <p className="ml-[-15px] whitespace-pre-line py-2 font-Poppins text-[16px] leading-8">
            <span className="font-bold">1. Điều Khoản Sử Dụng:</span> Bằng việc truy cập và sử dụng
            nền tảng của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định.
            Nền tảng này cung cấp các khóa học trực tuyến dành cho cá nhân và việc sử dụng phải tuân
            theo quy định về bản quyền và sở hữu trí tuệ.
          </p>
          <br />
          <p className="ml-[-15px] whitespace-pre-line py-2 font-Poppins text-[16px] leading-8">
            <span className="font-bold">2. Chính Sách Thanh Toán:</span> Bạn cần phải thanh toán đầy
            đủ trước khi truy cập vào các khóa học có trả phí. Chúng tôi chấp nhận các phương thức
            thanh toán phổ biến như chuyển khoản ngân hàng, ví điện tử và thẻ tín dụng. Mọi giao
            dịch đều được bảo mật và xử lý theo quy định của pháp luật Việt Nam.
          </p>
          <br />
          <p className="ml-[-15px] whitespace-pre-line py-2 font-Poppins text-[16px] leading-8">
            <span className="font-bold">3. Chính Sách Hoàn Tiền:</span> Học viên có quyền yêu cầu
            hoàn tiền trong vòng 7 ngày kể từ ngày mua khóa học nếu chưa truy cập quá 30% nội dung
            khóa học. Việc hoàn tiền sẽ được xử lý trong vòng 5-7 ngày làm việc và có thể phải chịu
            phí xử lý giao dịch (nếu có).
          </p>
          <br />
          <p className="ml-[-15px] whitespace-pre-line py-2 font-Poppins text-[16px] leading-8">
            <span className="font-bold">4. Quyền Sở Hữu Trí Tuệ:</span> Tất cả nội dung khóa học,
            bao gồm video, tài liệu, bài tập và các tài nguyên khác đều thuộc quyền sở hữu của chúng
            tôi. Học viên không được phép sao chép, chia sẻ hoặc phân phối lại nội dung khóa học
            dưới bất kỳ hình thức nào khi chưa có sự đồng ý bằng văn bản.
          </p>
          <br />
          <p className="ml-[-15px] whitespace-pre-line py-2 font-Poppins text-[16px] leading-8">
            <span className="font-bold">5. Thay Đổi Điều Khoản:</span> Chúng tôi có quyền sửa đổi
            các điều khoản này vào bất kỳ lúc nào. Những thay đổi sẽ có hiệu lực ngay khi được đăng
            tải trên nền tảng. Việc tiếp tục sử dụng nền tảng sau khi thay đổi đồng nghĩa với việc
            bạn chấp nhận các điều khoản mới.
          </p>
        </ul>
      </div>
      <br />
      <br />
    </>
  );
};

export default Policy;
