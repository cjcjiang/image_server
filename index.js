
var express = require('express');
var path = require('path');
var multer = require('multer');
var serveStatic = require('serve-static');
var fs = require('fs');

var app = express();

var ftp_path = './ftp';
if (!fs.existsSync(ftp_path)) {
    fs.mkdirSync(ftp_path);
}

var image_storage_path = './ftp/images';
if (!fs.existsSync(image_storage_path)) {
    fs.mkdirSync(image_storage_path);
}

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./ftp/images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
var upload = multer({ storage: storage });

app.set('views', path.join(__dirname,'app','views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(serveStatic('ftp', {'index': ['default.html', 'default.htm']}));

app.get("/", function(req, res) {
    res.render("homepage.ejs");
    console.log("Show the homepage");
});

app.post("/api/image_uploader/", upload.single('user_image'), function(req, res) {
    var user_image_path = req.file.path;
    var user_image_name = req.file.filename;
    console.log("User's image is stored in the path: " + user_image_path);
    var access_http_url = "http://localhost:3000/images/" + user_image_name;
    console.log("The http access url should be: " + access_http_url);
    res.send("The http access url should be: " + access_http_url);
});

app.listen(3000, function () {
    console.log('Image uploader app listening on port 3000!')
});

module.exports = app;

