const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedInUserOnly, checkAuth } = require("./middleware/auth");
require("dotenv").config();

const urlRouter = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRouter = require("./routes/user");

const URL = require("./models/url");

const app = express();
const PORT = 8000;

(async function () {
  try {
    await connectToMongoDB(
      `mongodb+srv://sahajdargan:${process.env.password}@book-store-mern.cfvmtay.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Mongodb is connected");
  } catch (err) {
    console.error(err);
  }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/url", restrictToLoggedInUserOnly, urlRouter);
app.use("/", checkAuth, staticRouter);
app.use("/user", userRouter);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  res.redirect(entry.redirectedURL);
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
