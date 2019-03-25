var express = require("express"),
    app = express(),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    passportMongoose = require("passport-local-mongoose"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})
app.use(methodOverride("_method"));
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        next();
    }
    else {
        res.redirect("/login");
    }
}

var commentSchema = new mongoose.Schema({
    username: String,
    text: String
})

var Comment = mongoose.model("Comment", commentSchema);
var campgroundSchema = new mongoose.Schema({
   title: String,
   image: String,
   desc: String,
   comments:[ {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Comment"
   } ]
});

var Campground = mongoose.model("Campground", campgroundSchema);

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    Campgrounds: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campground"
        }]
});

userSchema.plugin(passportMongoose);

var User = mongoose.model("User", userSchema);
app.get("/", function(req, res) {
    res.render("home");
})

app.use(require("express-session")({
    secret: "Parents are the gods on Earth",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/register", function(req, res) {
    res.render("register");
})
    
app.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("register");
        } else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("campgrounds");
            });
        }    
    } )
})

app.get("/login", function(req, res) {
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    console.log(res);
    console.log(req);
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
})

app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
     if (err){
         console.log(err);
     } else {
        res.render("newComment", {campground: campground});     
     }  
    })
})

app.post("/campgrounds/:id/comment", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            var newComment = {
                text: req.body.text,
                username: req.user.username
            }
            Comment.create(newComment, function(err, newCom){
                if (err){
                    console.log(err);
                } else {
                    foundCampground.comments.push(newCom);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }});        
            }
        });});


app.get("/campgrounds",isLoggedIn , function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds", { campgrounds: allCampgrounds, currentUser:req.user });
        }
    })
})

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
})

app.get("/campgrounds/:id/edit", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      if (err){
          console.log(err);
      } else {
          res.render("edit", {foundCampground: foundCampground});
        }
    })
});

app.put("/campgrounds/:id/edit", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err){
          console.log(err);
      } else {
          console.log(updatedCampground);
          res.redirect("/campgrounds/" + updatedCampground._id);
        }
    })
});


app.delete("/campgrounds/:id", function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/campgrounds");    
        }
        else {
            res.redirect("/campgrounds");
        }
    })
}) 

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, campgrounds){
        if(err){
            console.log("Error in finding the ID");
        }
        else {
            console.log(campgrounds);
            res.render("show", {campgrounds: campgrounds, currentUser: req.user });
        }
    })
})

app.post("/campgrounds", function(req, res) {
    var n = req.body.name,
        i = req.body.image,
        d = req.body.desc,
        obj = {
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