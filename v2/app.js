var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true }));

var campgroundSchema = new mongoose.Schema({
   title: String,
   image: String,
   desc: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function(req, res) {
    res.render("home");
})

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log("Error");
        } else {
            res.render("campgrounds", { campgrounds: allCampgrounds });
        }
    })
})

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
})

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, found){
        if(err){
            console.log("Error in finding the ID");
        }
        else {
            res.render("show", {campgrounds: found});
        }
    })
})

app.post("/campgrounds", function(req, res) {
    var n = req.body.name;
    var i = req.body.image;
    var d = req.body.desc;
    var obj = {
        title: n,
        image: i,
        desc: d
    };
    Campground.create(obj, function(err, c) {
        if (err){
            console.log("Error in Pushing a new campground to the stack!");
        }
        else {
            console.log("Pushed Successfully.");
        }
    });
    res.redirect("/campgrounds");
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Running");
})