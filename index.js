const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('./config');
const mongoDbConnection = require('./config/dbconfig');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const { storage, fileFilter } = require('./utils/multer');
const multer = require('multer');
const checkAuth = require('./middlewares/checkAuth');
const YAML=require("yamljs")
const swaggerUi=require("swagger-ui-express")

const swaggerDocument = YAML.load('docs/swagger.yaml');

//load the database
mongoDbConnection();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multer({
	storage: storage,
	fileFilter: fileFilter
}).single('image')); // added the multer
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(helmet());

app.use(checkAuth); // use the authentication middleware

app.get('/', (req, res) => {
	res.send('Server working 🔥');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// You can set 404 and 500 errors
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	if (error.status === 404)
		res.status(404).json({ message: 'Invalid Request, Request Not found' });
	else {
		console.log(error);
		res.status(500).json({
			message: 'Oops, problem occurred while processing your request..',
		});
	}
});

const PORT = config.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} 🔥`);
});
