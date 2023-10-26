const express = require("express");
const {
  generateNewShortURL,
  getAnalytics,
  handleUserRedirect,
} = require("../controllers/url");
const router = express.Router();

router.post("/", generateNewShortURL);
router.get("/analytics/:shortId", getAnalytics);
router.get("/:shortId", handleUserRedirect);

module.exports = router;
