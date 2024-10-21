import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions) => {
  try {
    // tạo transporter
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const { email, subject, template, data } = options;

    // lấy ra đường dẫn tới file email template
    const templatePath = path.join(__dirname, "../mails/", template);

    // render template
    let html: string;
    try {
      html = await ejs.renderFile(templatePath, data);
    } catch (error) {
      throw new Error(`Lỗi tải email template: ${error.message}`);
    }

    // tạo mail header
    const mailHeader = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html,
    };

    // gửi mail
    await transporter.sendMail(mailHeader);
  } catch (error) {
    console.error(`Lỗi gửi mail: ${error.message}`);
    throw new Error(`Gửi mail không thành công!`);
  }
};

export default sendMail;
