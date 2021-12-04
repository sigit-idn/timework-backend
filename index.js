require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const apiPort = 3000;
const attendanceRouter = require("./src/routers/attendance");
const employeeRouter = require("./src/routers/employee");
const companyRouter = require("./src/routers/company");
const authenticationRouter = require("./src/routers/authentication");
const taskRouter = require("./src/routers/task");
const reportRouter = require("./src/routers/report");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDb = require("./src/config/db");
const sendNotification = require("./src/utils/sendNotification");
const session = require("express-session");
const notifications = require("./src/utils/notifications");
const { authorize } = require("./src/utils/authorization");
const { verify } = require("jsonwebtoken");

connectDb();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/v1/auth", authenticationRouter);
app.use("/v1/attendance", attendanceRouter);
app.use("/v1/task", taskRouter);
app.use("/v1/employee", employeeRouter);
app.use("/v1/report", reportRouter);
app.use("/v1/company", companyRouter);

app.get("/notifications", (req, res) => {
  console.log(req);
  res.writeHead(200, {
    connection: "keep-alive",
    "cache-control": "no-cache",
    "content-Type": "text/event-stream",
  });

  verify(req.query.auth, process.env.ACCESS_TOKEN, (_, auth) => {
    notifications.addListener((data) => {
      const notification = data.filter(({ to }) => to === auth._id);

      if (notification.length)
        res.write(`data: ${JSON.stringify(notification)}\n\n`, (err) => {
          if (err) return console.log(err);
        });
    }, auth?._id);
  });
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
