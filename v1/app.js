var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
var campgrounds = [{
    title: "Satpura Hills",
    image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg"
}, {
    title: "Himalayan Range",
    image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg"
}, {
    title: "Mount Rushmore",
    image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"
}, {
    title: "Sahyadri Range",
    image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"
}, {
    title: "Satpura Hills",
    image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg"
}, {
    title: "Himalayan Range",
    image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg"
}, {
    title: "Mount Rushmore",
    image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"
}, {
    title: "Sahyadri Range",
    image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"
}]

app.get("/", function(req, res) {
    res.render("home");
})

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", { campgrounds: campgrounds });
})

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
})

app.post("/campgrounds", function(req, res) {
    var n = req.body.name;
    var i = req.body.image;
    var obj = {
        title: n,
        image: i
    };
    campgrounds.push(obj);
    res.redirect("/campgrounds");
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Running");
})