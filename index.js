require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const config = require('./config');
const mongoDbConnection = require('./config/dbconfig');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
<<<<<<< HEAD
const productRoutes = require('./routes/product.route');
const upload = require('./utils/multer');
const { checkAuth } = require('./middlewares/checkAuth');
const globalErrHandler = require('./controllers/error.controller');
const ErrorHelper = require('./helpers/errorHelper');
=======
const { storage, fileFilter } = require('./utils/multer');
const multer = require('multer');
const { checkAuth } = require('./middlewares/checkAuth');
const YAML=require("yamljs")
const swaggerUi=require("swagger-ui-express")
>>>>>>> master

const swaggerDocument = YAML.load('docs/swagger.yaml');

//load the database
mongoDbConnection();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
<<<<<<< HEAD
app.use(upload.single('image'));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
=======
app.use(multer({
	storage: storage,
	fileFilter: fileFilter
}).single('image')); // added the multer
app.use('/uploads', express.static('uploads'));
>>>>>>> master
app.use(cors());
app.use(helmet());

app.use(checkAuth); // use the authentication middleware

app.get('/', (req, res) => {
	res.send('Server working 🔥');
});

<<<<<<< HEAD
app.use(['/docs', '/api/v1/docs'], swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
=======
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// You can set 404 and 500 errors
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});
>>>>>>> master

//handle Undefined routes
app.use("*", (req, res, next) => {
	const err = new ErrorHelper(404, "fail", "undefined route");
	next(err, req, res, next);
});

app.use(globalErrHandler);

const PORT = config.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} 🔥`);
});

<<<<<<< HEAD
module.exports = app;
=======
module.exports = app;
>>>>>>> master
