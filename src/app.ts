import express, { Express } from 'express';
import path from 'path';
import { connectDatabase } from './config/database';
import routes from './routes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDatabase();

// View engine setup
app.set('view engine', 'ejs');
// Resolve views path: works in both development (src/views) and production (dist/views)
const viewsPath = path.resolve(__dirname, 'views');
app.set('views', viewsPath);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    console.log(`Public URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }
});

export default app;

