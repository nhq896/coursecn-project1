class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: any, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    /**
     * tạo ra 1 stack gồm các hàm được gọi trước khi xảy ra lỗi
     * đọc thêm:
     * https://stackoverflow.com/questions/59625425/understanding-error-capturestacktrace-and-stack-trace-persistance
     * https://nodejs.org/api/errors.html#errorcapturestacktracetargetobject-constructoropt
     */
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
