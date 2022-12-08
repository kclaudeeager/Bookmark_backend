let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 8080;
let bookmark = require('./routes/bookmark');
let config = require('config'); //we load the db location from the JSON files
//db options
let options = { 
                server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 

const connectDB = async () => {
    try {
        await mongoose.connect(config.DBHost, {
            maxPoolSize: 50,
            wtimeoutMS: 2500,
            useNewUrlParser: true
        })
        mongoose.set('strictQuery', true);
        console.log('DB connected ')
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}
connectDB()
//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

app.get("/", (req, res) => res.json({message: "Welcome to our Bookmarking!"}));

app.route("/bookmark")
    .get(bookmark.getBookmarks)
    .post(bookmark.postBookmark);
app.route("/bookmark/:id")
    .get(bookmark.getBookmark)
    .delete(bookmark.deleteBookmark)
    .put(bookmark.updateBookmark);


app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing