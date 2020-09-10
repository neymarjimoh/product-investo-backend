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
const productRoutes = require('./routes/product.route');
const upload = require('./utils/multer');
const { checkAuth } = require('./middlewares/checkAuth');
const globalErrHandler = require('./controllers/error.controller');
const ErrorHelper = require('./helpers/errorHelper');

const swaggerDocument = YAML.load('docs/swagger.yaml');

//load the database
mongoDbConnection();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload.single('image'));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(cors());
app.use(helmet());

app.use(checkAuth);

app.get('/', (req, res) => {
	res.send('Server working 🔥');
});

app.use(['/docs', '/api/v1/docs'], swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

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

module.exports = app;
