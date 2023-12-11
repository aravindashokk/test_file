const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/fileUpload", (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});