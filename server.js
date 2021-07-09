/*please install necessary modules to make the application work 
node.js it is a external software must be downloaded for this to work
npm init -y
express
path
cors
body-parser
multer
npm install nodemon --save-dev
command to start the server is = npm run serve
*/
var express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

var app = express();
var port = process.env.PORT || 3001; //port can be changed according to your needs

// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// serving static files
app.use('/uploads', express.static('uploads'));

// handle storage using multer
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
	}
});
var upload = multer({ storage: storage });

// handle single file upload
app.post('/uploadfile', upload.single('dataFile'), (req, res, next) => {
	const file = req.file;
	if (!file) {
		return res.status(400).send({ message: 'Please upload a file.' }); //http error codes to rectify the issues
	}
	return res.send({ message: 'File uploaded successfully.', file });
});

// handle multiple file upload
app.post('/uploadmultifile', upload.array('dataFiles', 10), (req, res, next) => {
	const files = req.files;
	if (!files || (files && files.length === 0)) {
		return res.status(400).send({ message: 'Please upload the files.' });
	}
	return res.send({ message: 'File uploaded successfully.', files });//http error codes to rectify the issues
});

app.get('/', (req, res) => {
	res.send('Hi! Welcome to Node.js uploader');//successfull running of server
});

app.listen(port, () => {
	console.log('Server started on: ' + port);
});
/*you can check the runnin gserver with examples using postman*/