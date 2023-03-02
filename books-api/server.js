const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieSession = require("cookie-session")

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "application-session",
    secret: "COOKIE_SECRET",
    httpOnly: true
  })
)

const db = require("./src/models");
const Role = db.role;
db.sequelize.sync({ force: true }).then(() => {
    console.log("db akan disetel ulang sambil membuat role baru")
    initial()
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;

require('./src/routes/auth.route')(app);
require("./src/routes/author.route")(app);
require("./src/routes/book.route")(app);
require("./src/routes/publisher.route")(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "admin"
  });
}