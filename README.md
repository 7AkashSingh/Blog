# 📝 BlogHub - Full Stack MERN Blogging Platform

A modern, feature-rich blogging platform built with the **MERN Stack** where users can create, discover, and interact with blogs. The application provides authentication, blog management, social interactions, notifications, and a responsive user interface.

---

## 🚀 Features

### 👤 Authentication & Authorization
- User Registration & Login
- Secure JWT Authentication
- Protected Routes
- Role-based Authorization
- Persistent Login

### ✍️ Blog Management
- Create Blogs
- Edit Blogs
- Delete Blogs
- View Blog Details
- Upload Cover Images
- Rich Blog Content
- Categories & Tags
- Search Blogs

### ❤️ Social Features
- Like / Unlike Blogs
- Comment on Blogs
- Follow / Unfollow Users
- View User Profiles
- Related Blogs
- Trending Blogs
- Latest Blogs

### 🔔 Notifications
- Like Notifications
- Comment Notifications
- Follow Notifications
- Mark Notifications as Read
- Unread Notification Count

### 👨‍💻 User Dashboard
- My Blogs
- Profile Page
- Update Profile
- View Followers & Following

### 🎨 Frontend
- Responsive Design
- Modern UI
- Loading States
- Error Handling
- Redux Toolkit State Management
- React Router Protected Routes

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary

---

# 📂 Project Structure

```
BlogHub
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── redux
│   │   ├── services
│   │   └── utils
│   │
│   └── public
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── utils
│   ├── config
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/yourusername/bloghub.git
```

Move into the project

```bash
cd bloghub
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret

REFRESH_TOKEN_SECRET=your_refresh_token_secret

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=http://localhost:5173
```

Run Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:8000
```

---

# 📸 Screenshots

> Add screenshots here

- Home Page
- Blog Details
- Login
- Register
- Profile
- Notifications
- Create Blog
- My Blogs

---

# 📌 Future Improvements

- Bookmark Blogs
- Dark Mode
- Rich Text Editor
- Email Verification
- Password Reset
- Admin Dashboard
- Infinite Scrolling
- Blog Analytics
- Real-time Notifications
- Chat System

---

# 🤝 Contributing

Contributions are welcome!

Fork the repository and submit a Pull Request.

---

# ⭐ Show Your Support

If you like this project, don't forget to ⭐ the repository.
