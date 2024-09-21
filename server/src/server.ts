import { app } from "./app";
import connectDB from "./utils/db";

const port = process.env.SERVER_PORT || 8000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  connectDB();
});
