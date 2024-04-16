const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const router = require("./Routes/reports.js");
const app = express();

config({ path: "./config.env" });

const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));

// app.use(cors({
//   origin: [process.env.FRONTEND_URL],
//   methods: ["GET", "POST", "PUT", "DELETE"],
// }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  console.log('Request URL:', req.url);
  next();
});


app.use("/", router);

app.listen(PORT, () =>
  console.log(`The server has started at PORT number : ${PORT}`)
);
