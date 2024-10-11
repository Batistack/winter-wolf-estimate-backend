# Winter Wolf Estimate Backend
The backend for the Winter Wolf Estimate application manages HVAC equipment, accessories, users, and estimate calculations. This API allows for creating estimates, managing data, and performing various operations related to HVAC estimate generation.

# Technologies Used
Node.js: Server-side runtime environment.
Express.js: Web framework for routing and handling HTTP requests.
PostgreSQL: Database for storing and managing estimate-related data.
pg-promise: PostgreSQL client for interacting with the database.
dotenv: Environment variable management.
bcrypt: Password hashing for secure authentication.
cors: Middleware to enable cross-origin requests.
nodemon: Development tool that automatically restarts the server on file changes.


# Features
Manage HVAC equipment and accessories.
User registration, authentication, and management.
Create and retrieve estimates.
Calculate totals for equipment, accessories, and labor.
API Endpoints
Base URL: /api
GET /api/equipment: Fetch all available equipment.
GET /api/accessories: Fetch all available accessories.
POST /api/estimate: Create a new estimate.
POST /api/register: Register a new user.
POST /api/login: Authenticate and log in a user.
