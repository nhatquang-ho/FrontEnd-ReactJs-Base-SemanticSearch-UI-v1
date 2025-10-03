# React Product Management Frontend (Updated)

A modern React.js frontend application for product management with semantic search capabilities, fully integrated with your Spring Boot backend API. This version matches your exact API specification.

## 🎯 Features

- 🔐 **Authentication**: Login with username/password, JWT token management with auto-refresh
- 📦 **Product Management**: Full CRUD operations with semantic search
- 🔍 **Semantic Search**: AI-powered natural language product search
- 👥 **User Management**: Admin panel for user administration
- 🎨 **Modern UI**: Material-UI components with responsive design
- 🛡️ **Role-Based Access**: USER and ADMIN role permissions
- 📱 **Mobile Responsive**: Optimized for all devices

## 🔧 Tech Stack

- **Frontend**: React 18, Material-UI, React Router
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT tokens with auto-refresh
- **UI Library**: Material-UI (MUI)

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Your Spring Boot backend running on http://localhost:8080

### Installation

1. **Extract and setup**:
   ```bash
   unzip react-product-frontend-updated.zip
   cd react-product-frontend-updated
   npm install
   ```

2. **Configure environment**:
   ```bash
   # The .env.development is already configured
   # Verify your backend URL in .env.development
   REACT_APP_API_URL=http://localhost:8080/api
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

   App available at: `http://localhost:3000`

## 📡 API Integration

This frontend is designed to work with your exact API specification:

### Authentication Endpoints
- `POST /api/auth/register` - User registration (username, email, password, firstName, lastName)
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

### Product Endpoints
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (USER/ADMIN)
- `GET /api/products/{id}` - Get product by ID
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Soft delete product
- `POST /api/products/semantic-search` - Semantic search with query body
- `GET /api/products/search?name=...` - Search products by name
- `GET /api/products/categories` - Get categories
- `GET /api/products/filter` - Filter products with pagination

### User Endpoints (Admin)
- `GET /api/users/paginated` - Get paginated users
- `GET /api/users/profile` - Current user profile
- `GET /api/users/search?name=...` - Search users by name
- `PATCH /api/users/{id}/activate` - Activate user
- `PATCH /api/users/{id}/deactivate` - Deactivate user

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Login, Register forms
│   ├── Common/         # LoadingSpinner, ErrorMessage, etc.
│   ├── Layout/         # App layout with navigation
│   ├── Products/       # ProductCard, ProductForm
│   └── Users/          # User-related components
├── contexts/           # React contexts (AuthContext)
├── hooks/              # Custom React hooks (useAuth)
├── pages/              # Page components
│   ├── Auth/          # Login, Register pages
│   ├── Products/      # Product management pages
│   └── Users/         # User management pages
├── services/          # API service layer
│   ├── api.js         # Axios configuration
│   ├── authService.js # Authentication API
│   ├── productService.js # Product API
│   └── userService.js # User API
├── utils/             # Utility functions
│   ├── constants.js   # App constants
│   ├── helpers.js     # Helper functions
│   └── validation.js  # Form validation
└── styles/           # Global styles
```

## 🎨 Key Features

### Authentication
- Username/password login (not email)
- JWT token with refresh token
- Auto-logout on token expiration
- Role-based route protection

### Product Management
- Create, edit, delete products
- Field names: `name`, `description`, `price`, `category`, `stockQuantity`, `isActive`
- Category filtering and search
- Stock quantity tracking

### Semantic Search
- POST request to `/api/products/semantic-search`
- Natural language queries (e.g., "comfortable office chair")
- AI-powered result ranking
- Search history and suggestions

### User Management (Admin)
- User listing with pagination
- Search users by name
- Activate/deactivate users
- View user details and roles

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8080/api` |
| `REACT_APP_ENVIRONMENT` | Environment name | `development` |
| `REACT_APP_API_TIMEOUT` | API timeout in ms | `10000` |

### Data Mapping

The app automatically maps between frontend and backend data structures:

**Login Response**:
- `accessToken` → stored as 'token'
- `refreshToken` → stored for auto-refresh
- `userId`, `username`, `email`, `roles` → user profile

**Product Data**:
- `stockQuantity` (not 'stock')
- `isActive` (not 'active')
- `createdAt` for timestamps

**User Data**:
- `isActive` for user status
- `roles` array for permissions

## 🔧 Development

### Available Scripts

- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

### CORS Setup

Make sure your Spring Boot backend has CORS configured:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 🔍 Semantic Search Usage

The semantic search feature uses your backend's embedding-based search:

1. User enters natural language query
2. Frontend sends POST request to `/api/products/semantic-search`
3. Backend processes with AI embeddings
4. Results ranked by semantic similarity
5. Frontend displays results with relevance indicators

Example queries that work well:
- "comfortable ergonomic chair for office work"
- "waterproof outdoor camping gear"
- "professional business furniture"

## 🚀 Production Deployment

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Update environment**:
   ```env
   REACT_APP_API_URL=https://your-api-domain.com/api
   REACT_APP_ENVIRONMENT=production
   ```

3. **Deploy** the `build` folder to your web server

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS is configured for your domain
2. **API connection**: Verify `REACT_APP_API_URL` matches backend
3. **Token issues**: Check JWT token format and expiration handling
4. **Search not working**: Ensure semantic search endpoint returns array

### API Response Format

Expected responses match your OpenAPI specification:

```json
// Login Response
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token", 
  "userId": 1,
  "username": "alice",
  "email": "alice@example.com",
  "roles": ["USER"]
}

// Product Response
{
  "id": 1,
  "name": "Ergonomic Chair",
  "description": "Comfortable office chair",
  "price": 299.99,
  "category": "mobilier",
  "stockQuantity": 10,
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Support

For issues or questions:
1. Check API endpoint URLs match your backend
2. Verify CORS configuration
3. Check browser developer tools for network errors
4. Ensure backend is running and accessible
