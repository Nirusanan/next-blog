## Blog Post App
This project is a Blog Post Application built using Next.js 14. It features user authentication, OTP verification, blog post creation, viewing functionality, likes, and comments.

### Features
- User authentication and authorization.
- OTP verification for enhanced security.
- Create, view, and manage blog posts.
- Like and comment on blog posts (only for authenticated users).
- Secure access to create and view post pages, ensuring only authenticated users can access them.
- Utilizes MongoDB for the database.
- FontAwesome icons for UI enhancements.
- Generate blog using Large Language Model



### Getting Started

Install dependencies:
```bash
npm install
```

Create a .env.local file in the root of the project:
```bash
MONGODB_URI=your-mongodb-URI
NEXT_PUBLIC_API_URL=http://localhost:3000/api
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
NEXTAUTH_SECRET= your-secret-key
CLOUDINARY_CLOUD_NAME= cloud-name
CLOUDINARY_API_KEY= api-key
CLOUDINARY_API_SECRET= api-secret
GROQ_API_KEY = groq-api-key
```

Run the development server:
```bash
npm run dev
```


