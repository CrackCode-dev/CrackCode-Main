# JWT AUTH SETUP
### 1. Backend Setup

Navigate to the `server` directory.

1.  **Install Dependencies:**
    ```bash
    cd server
    npm install
    ```

2.  **Environment Configuration:**
    Create a `.env` file in the `server` root and add your credentials:
    ```env
    PORT=4000
    MONGODB_URL="your_mongodb_connection_string"
    JWT_SECRET="your_super_secret_key"
    NODE_ENV="development"

    # Email Service (e.g., Brevo/SMTP)
    SMTP_USER="your_smtp_user"
    SMTP_PASSWORD="your_smtp_password"
    SENDER_EMAIL="your_sender_email@example.com"
    ```

3.  **Start Server:**
    ```bash
    npm run server
    # Server runs on http://localhost:4000
    ```

### 2. Frontend Setup

Navigate to the `client` directory.

1.  **Install Dependencies:**
    ```bash
    cd client
    npm install
    ```

2.  **Environment Configuration:**
    Create a `.env` file in the `client` root:
    ```env
    VITE_BACKEND_URL=http://localhost:4000
    ```

3.  **Start Application:**
    ```bash
    npm run dev
    # App runs on http://localhost:5173
    ```

---
