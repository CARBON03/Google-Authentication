import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth20";

const app = express();
const port= 3000;

app.use(session({
    secret: "something",
    resave: false,
    saveUninitialized: true,
})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",   
        },
        (accessToken, refreshToken, Profile,Done) => {
            return Done (null, Profile);
        }
    )
);

passport.serializeUser((user , done) => done(null , user));
passport.deserializeUser((user , done) => done(null , user));

app.use(bodyParser.urlencoded({ extended: true}));

app.get( "/", (req,res) =>{
    res.send("<a href='/auth/google'>Login With Google</a>");
});

app.get( "/auth/google" , passport.authenticate("google" , {scope : ["profile" , "email"]}));

app.get("/auth/google/callback" , passport.authenticate("google" , {failureRedirect: "/"}), (req,res) =>{
    res.redirect("/SkySync/Home")
});

app.get("/SkySync/Home", (req,res) => {
    res.send(`Welcome ${req.user.displayName}  <a href='/logout'>Logout</a>`);
});

app.get("/logout", (req,res) => {
    req.logOut(() =>{
    res.redirect("/"); 
    });
});

app.listen(port, () => {
    console.log(`Server running on ${port}.`);
});