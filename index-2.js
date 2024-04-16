const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const router = require("./Routes/reports.js");
const app = express();

config({ path: "./config.env" });

const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.use("/", router);

app.listen(PORT, () =>
  console.log(`The server has started at PORT number : ${PORT}`)
);
