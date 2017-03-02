const express = require("express");
const path = require("path");
const request = require("request");
const fs = require("fs");
const queryString = require("query-string");

const app = express();

const SCHEDULER_APP_ID = "1108439522617596";
const SCHEDULER_APP_SECRET = "";
const SCHEDULER_APP_REDIRECT_URI = "http://localhost:3000/fb_login";
const FB_PAGE_ID = "";
const FB_GRAPH = "https://graph.facebook.com/";
const FB_PAGE_END_POINT = FB_GRAPH + FB_PAGE_ID; 
const PAGE_TOKE_PATH = path.join(__dirname + "/token/page_token.json");

// Variables for the user and page tokens
var user_token, page_token;

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/script.js", function (req, res) {
  res.sendFile(path.join(__dirname, "script.js"));
})

app.get("/success_script.js", function (req, res) {
  res.sendFile(path.join(__dirname, "success_script.js"));
})

app.get("/fb_login", function(req, res) {
  request.get("https://graph.facebook.com/v2.8/oauth/access_token?" + queryString.stringify(
    {
      "client_id": SCHEDULER_APP_ID,
      "redirect_uri": SCHEDULER_APP_REDIRECT_URI,
      "client_secret": SCHEDULER_APP_SECRET,
      "code": req.query.code
    }
  )).on("response", function(response) {
    if (response.statusCode == 200) {
        response.on("data", function(data) {
          // getting the user token
          user_token = JSON.parse(data).access_token;
          // getting the page token
          request.get(FB_PAGE_END_POINT + "?" + queryString.stringify({
            "fields": "access_token",
            "access_token": user_token
            })
          ).on("data", function(data) {
            page_token = JSON.parse(data).access_token;
          })
      })
    }
  })

  res.redirect("/success");
})

app.get("/success", function(req, res) {
  res.sendFile(path.join(__dirname, "success.html"));
})

app.get("/post_test", function(req, res) {
  var jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, "../image_generator/outputs/times.json"), "utf8"));
  var post_number = Object.keys(jsonData).length;
  for (var i = 1; i <= post_number; i++) {
    var caption = jsonData[i.toString()][0];
    var scheduleDate = jsonData[i.toString()][1];
  
    var fbScheduleReq = request.post(FB_PAGE_END_POINT + "/photos?" + queryString.stringify({
      "caption": caption,
      "access_token": page_token,
      "scheduled_publish_time": scheduleDate,
      "published": false
    }))

    var form = fbScheduleReq.form();
    form.append("file", fs.createReadStream(path.join(__dirname, "../image_generator/outputs/" + i.toString() + ".png")));
    fbScheduleReq.on("data", data => console.log(JSON.parse(data)));
  };
  res.redirect("/posted");
})

app.get("/posted", (req, res) => res.sendFile(path.join(__dirname, "posted.html")))

app.listen(3000, function () {
  console.log("Facebook scheduler on port:3000");
})