# ImageVault: Safe Permission-Based Image Storage 🛡️📸

## 📖 Project Overview
ImageVault is a secure, role-based backend REST API built with Node.js and Express. It provides an efficient platform for user authentication and permission-based image management. Designed with security in mind, the application ensures that only authenticated users can browse images, while only authorized **admin** users are permitted to upload and delete images. The project seamlessly integrates **MongoDB** for data persistence and **Cloudinary** for reliable cloud-based image storage.

## ✨ Features
- **Secure Authentication**: User registration, login, and password management securely handled using `bcryptjs` and `jsonwebtoken` (JWT).
- **Role-Based Access Control (RBAC)**: Distinguishes between standard `user` and `admin` roles to protect sensitive routes.
- **Cloud Image Storage**: Direct integration with Cloudinary for scalable and secure image hosting.
- **Robust Upload Middleware**: Uses `multer` for handling `multipart/form-data`, ensuring only image files under 5MB are accepted.
- **Advanced Querying**: Image fetching supports pagination (`page`, `limit`) and sorting (`sortBy`, `sortOrder`).
- **Data Integrity**: Admins can only delete images they personally uploaded, preventing accidental data loss by other admins.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Cloud Storage**: Cloudinary
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcryptjs (Password Hashing)
- **File Uploads**: multer
- **Environment Management**: dotenv

## 🚀 Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ImageVault-Safe-permission-based-image-storage
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) below).

4. **Start the application:**
   - For development (using nodemon):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

## 🔐 Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user (`username`, `email`, `password`, `role`) | Public |
| `POST` | `/login` | Login and receive a JWT | Public |
| `POST` | `/change-password` | Change user password (`oldPassword`, `newPassword`) | **Auth** |

### User/Home (`/api/home`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/welcome` | Returns user details and welcome message | **Auth** |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/welcome` | Admin-only welcome dashboard message | **Auth + Admin** |

### Images (`/api/image`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/upload` | Upload an image (Field name: `image`) | **Auth + Admin** |
| `GET` | `/get` | Fetch all images. Supports `?page=1&limit=2&sortBy=createdAt&sortOrder=asc` | **Auth** |
| `DELETE` | `/:id` | Delete an image by its Database ID | **Auth + Admin** |

> **Note:** For protected routes, pass the JWT in the headers as: `Authorization: Bearer <your_jwt_token>`

## 📁 Folder Structure

```text
├── config/
│   └── cloudinary.js       # Cloudinary setup and configuration
├── controllers/
│   ├── auth-controller.js  # Logic for auth routes (register, login, etc.)
│   └── imageControllers.js # Logic for image handling (upload, fetch, delete)
├── database/
│   └── db.js               # MongoDB connection logic
├── helpers/
│   └── cloudinaryHelper.js # Helper function to interact with Cloudinary API
├── middleware/
│   ├── admin-middleware.js # Validates if the authenticated user is an admin
│   ├── auth-middleware.js  # Validates and decodes the JWT token
│   └── upload-middleware.js# Multer configuration for file size and type limits
├── models/
│   ├── Image.js            # Mongoose schema for Images
│   └── User.js             # Mongoose schema for Users
├── routes/
│   ├── admin-routes.js     # Admin specific routing
│   ├── auth-routes.js      # Authentication routing
│   ├── home-routes.js      # Standard user routing
│   └── image-routes.js     # Image management routing
├── uploads/                # Temporary local directory for multer uploads
├── server.js               # Application entry point & Express setup
└── package.json            # Dependencies and npm scripts
```

## 🎮 Usage Instructions

1. **Register an Admin Account:**
   Send a `POST` request to `/api/auth/register` with the following JSON body:
   ```json
   {
     "username": "adminUser",
     "email": "admin@example.com",
     "password": "securepassword",
     "role": "admin"
   }
   ```

2. **Login:**
   Send a `POST` request to `/api/auth/login` with your credentials to obtain the `accessToken`.

3. **Upload an Image:**
   - Route: `POST /api/image/upload`
   - Headers: `Authorization: Bearer <accessToken>`
   - Body Type: `multipart/form-data`
   - Key: `image` (Type: File) -> Select your image file to upload.

4. **Fetch Images:**
   - Route: `GET /api/image/get?page=1&limit=5`
   - Headers: `Authorization: Bearer <accessToken>`

## 🔮 Future Improvements

- [ ] **Frontend Client**: Develop a web interface using React, Vue, or Angular to consume the APIs.
- [ ] **Email Verification & Password Reset**: Implement NodeMailer to verify user emails and handle secure password resets.
- [ ] **Rate Limiting**: Integrate `express-rate-limit` to safeguard authentication endpoints from brute-force attacks.
- [ ] **Automated Testing**: Set up unit and integration tests using frameworks like Jest and Supertest.
- [ ] **Dockerization**: Add a `Dockerfile` and `docker-compose.yml` for simplified environment setup and deployment.
- [ ] **Image Compression**: Further compress images using libraries like `sharp` before uploading to Cloudinary.

## 🤝 Contribution Guide

Contributions are welcome! Please follow these steps to contribute:

1. **Fork** the repository.
2. **Create** a new branch (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. **Open** a Pull Request.

Please ensure your code follows the existing style, includes appropriate comments, and successfully passes all internal checks.
