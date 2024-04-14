const express = require('express');
const app = express();
const makeRequest = require('./services/request');
require('dotenv').config();
const { rootUrl, arrToLinks, createLink, formatUrl } = require('./services/utils');

const PORT = 3000;
const auth = process.env.AUTH;

// Settings
app.use(express.static(__dirname + '/public'));
app.use(express.json())

// PAGES
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/404", (req, res) => {
  res.sendFile(__dirname + "/views/404.html");
});

// MIDDLEWARES

const authUser = (req, res, next) => {
  const password = req.body.urlInfo.password;

  if (password === auth) { 
    next();
  } else {
    res.status(401).json({ code: "error", message: "You aren't authenticated" });
  }
}

// API

app.use("/create-link", authUser);
app.post("/create-link", (req, res) => {
  const { url, aliase } = req.body.urlInfo;
  const linkSet = { url: url, alias: aliase };
  const query = "INSERT INTO links SET ?";

  makeRequest(query, linkSet).then(result => {
    const { code, content } = result;

    if (code === "success" && content.affectedRows > 0) {
      res.status(200).json({
        code: 'success',
        message: "for url " + url + " create aliase: " + aliase,
        url: createLink(aliase),
      });
    } else {
      res.status(400).json({ code: "error", message: "Create new link shorted failed, try using other hash" });
    }
  });
});

app.get("/l/:link", (req, res) => {
  const link = req.params.link;
  const query = "SELECT url FROM links WHERE alias = ?;";

  makeRequest(query, [link]).then(result => {
    const { code, content } = result;

    if (code === "success" && content.length > 0) {
      res.redirect(formatUrl(content[0].url));
    } else {
      res.status(404).redirect('/404');
    }
  });
});

app.get('/recent-links', (req, res) => {
  const query = 'SELECT alias, url from links ORDER BY linkDate DESC LIMIT 10;';

  makeRequest(query).then(result => {
    const { code, content } = result;

    if (code === "success" && content.length > 0) {
      res.status(200).json(arrToLinks(content));
    } else if (code === "error") {
      res.status(404).json({ code: "error", message: "Get recent links failed: " + content });
    }
  });
});

// SERVER LISTEN

app.listen(PORT, () => {
  console.log("Listen in: ", rootUrl);
});