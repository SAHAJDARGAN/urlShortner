const URL = require("../models/url");

async function generateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });

  const { nanoid } = await import("nanoid");
  const shortID = nanoid(8);

  await URL.create({
    shortId: shortID,
    redirectedURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });

  return res.render("home", {
    id: shortID,
  });
  // return res.json({ id: shortID });
}

async function getAnalytics(req, res) {
  const shortId = req.params.shortId;
  const entry = await URL.findOne({ shortId });
  return res.json({
    totalClicks: entry.visitHistory.length,
    analytics: entry.visitHistory,
  });
}

async function handleUserRedirect(req, res) {
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
}

module.exports = {
  generateNewShortURL,
  getAnalytics,
  handleUserRedirect,
};
