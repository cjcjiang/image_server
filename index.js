
var express = require('express');
var path = require('path');
var multer = require('multer');
var serveStatic = require('serve-static');
var fs = require('fs');
var unzip = require('unzip');

var app = express();

var ftp_path = './ftp';
if (!fs.existsSync(ftp_path)) {
    fs.mkdirSync(ftp_path);
}

var image_storage_path = './ftp/images';
if (!fs.existsSync(image_storage_path)) {
    fs.mkdirSync(image_storage_path);
}

var zip_storage_path = './ftp/zip';
if (!fs.existsSync(zip_storage_path)) {
    fs.mkdirSync(zip_storage_path);
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

var storage_zip = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./ftp/zip");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload_zip = multer({ storage: storage_zip });

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
    res.send("The http access url should be: <br>" + access_http_url);
});

app.post("/api/zip_uploader/", upload_zip.single('user_zip'), function(req, res) {
    var user_zip_path = req.file.path;
    var user_zip_name = req.file.filename;
    console.log("User's image is stored in the path: " + user_zip_path);
    var unzip_path = "./ftp/unzip_" + user_zip_name;
    if (!fs.existsSync(unzip_path)) {
        fs.mkdirSync(unzip_path);
    }
    fs.createReadStream(user_zip_path)
        .pipe(unzip.Extract({ path: unzip_path }))
        .on('close', function () {
            fs.readdir(unzip_path, function (err, file_names) {
                if (err) {
                    throw err;
                }

                console.log(file_names);
                var access_http_url_array = [];
                file_names.forEach(function (file_name) {
                    var unzip_path_for_access = "unzip_" + user_zip_name + "/";
                    var access_http_url = "http://localhost:3000/" + unzip_path_for_access + file_name;
                    access_http_url_array.push(access_http_url);
                });
                res.send(access_http_url_array);
            });
        });
});

app.listen(3000, function () {
    console.log('Image uploader app listening on port 3000!')
});

module.exports = app;

