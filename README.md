# Twitter Clone (X Clone)

A full-stack Twitter/X clone built with the MERN stack, featuring real-time updates, authentication, and modern UI components.

## 🚀 Features

- **User Authentication** - Secure signup, login, and logout with JWT tokens
- **User Profiles** - Customizable profiles with profile/cover images, bio, and links
- **Posts** - Create, delete, like, and comment on posts with image support
- **Follow System** - Follow/unfollow users and view posts from followed users
- **Notifications** - Real-time notifications for likes, comments, and follows
- **Suggested Users** - Discover new users to follow
- **Responsive Design** - Modern UI with TailwindCSS and DaisyUI
- **Image Upload** - Cloudinary integration for profile and post images
- **Dark Theme** - Beautiful dark mode interface

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **DaisyUI** - Component library
- **React Router DOM** - Client-side routing
- **TanStack Query (React Query)** - Data fetching and state management
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting and management
- **Multer** - File upload handling
- **Cookie Parser** - Cookie parsing middleware

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yashuchirag/twitter-clone.git
   cd twitter-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install --prefix frontend
   ```

3. **Environment Variables**
   
   Create a [.env](cci:7://file:///d:/Personal%20Projects/Twitter%20Clone/twitter-clone/.env:0:0-0:0) file in the root directory with the following variables:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # MongoDB
   MONGO_URI=your_mongodb_connection_string

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

## 🚀 Running the Application

### Development Mode

**Run both frontend and backend concurrently:**
```bash
# Terminal 1 - Backend (runs on port 4000)
npm run dev

# Terminal 2 - Frontend (runs on port 3000)
cd frontend
npm run dev
```

### Production Mode

```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

The application will serve the built frontend from the backend server.

## 📁 Project Structure

```
twitter-clone/
├── backend/
│   ├── controllers/       # Route controllers
│   ├── db/               # Database connection
│   ├── lib/              # Utility functions
│   ├── middleware/       # Custom middleware (auth, etc.)
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── server.js         # Express server setup
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main App component
│   │   └── main.jsx      # Entry point
│   ├── index.html        # HTML template
│   └── vite.config.js    # Vite configuration
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
└── package.json         # Root package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/user/profile/:username` - Get user profile
- `GET /api/user/suggested` - Get suggested users
- `POST /api/user/follow/:id` - Follow/unfollow user
- `POST /api/user/update` - Update user profile

### Posts
- `GET /api/post/all` - Get all posts
- `GET /api/post/following` - Get posts from followed users
- `GET /api/post/likes/:id` - Get user's liked posts
- `GET /api/post/user/:username` - Get user's posts
- `POST /api/post/create` - Create a new post
- `POST /api/post/like/:id` - Like/unlike a post
- `POST /api/post/comment/:id` - Comment on a post
- `DELETE /api/post/:id` - Delete a post

### Notifications
- `GET /api/notifications` - Get user notifications
- `DELETE /api/notifications` - Delete all notifications
- `DELETE /api/notifications/:id` - Delete a notification

## 🎨 Features in Detail

### Authentication System
- JWT-based authentication with HTTP-only cookies
- Password hashing with bcryptjs
- Protected routes with middleware

### Post Management
- Create posts with text and images
- Like/unlike posts
- Comment on posts
- Delete own posts
- View posts from all users or only followed users

### User Profiles
- Customizable profile and cover images
- Bio and website link
- View user's posts and liked posts
- Follower/following counts

### Notifications
- Get notified when someone:
  - Likes your post
  - Comments on your post
  - Follows you

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- HTTP-only cookies
- Protected API routes
- Input validation
- CORS configuration

## 🌐 Deployment

The application is configured for easy deployment with:
- Production build script
- Static file serving in production mode
- Environment-based configuration

## 👨‍💻 Author

**Chirag**

## 📝 License

ISC

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if you like this project!

---

**Note:** Make sure to set up your environment variables correctly before running the application. Never commit your [.env] file to version control.