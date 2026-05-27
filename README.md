# SecureVault

A simple, secure notes application that uses client-side encryption. The backend just stores the encrypted text and doesn't have the keys to read it.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS & shadcn/ui
- React Query (@tanstack/react-query)
- Axios
- Web Crypto API

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

---

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see required variables below).
4. Start the dev server:
   ```bash
   npm run dev
   ```
   *(Runs on `http://localhost:3000`)*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see required variables below).
4. Start the Vite server:
   ```bash
   npm run dev
   ```
   *(Runs on `http://localhost:5173`)*

---

## Environment Variables

### Backend `.env`
Create a `.env` file in the `Backend/` folder:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/securevault?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

### Frontend `.env`
Create a `.env` file in the `Frontend/` folder:

```env
VITE_ENCRYPTION_KEY=your_secure_frontend_key_here
```

---

## API Routes

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Registers user and returns a JWT. |
| POST | `/api/auth/login` | No | Authenticates user and returns a JWT. |
| GET | `/api/notes` | Yes | Fetches all encrypted notes for the logged-in user. |
| POST | `/api/notes` | Yes | Saves a new encrypted note payload. |
| DELETE | `/api/notes/:id` | Yes | Deletes a note. |

---

## Encryption Setup

The app handles encryption in the browser using the native Web Crypto API.

### 1. Why AES-256-GCM?
AES is standard symmetric encryption. The GCM mode is great because it handles both encryption (hiding data) and integrity checking (making sure the data wasn't messed with) built-in. 256-bit is a solid key size for web apps.

### 2. IV Handling
The Initialization Vector (IV) is uniquely generated for every single note using `window.crypto.getRandomValues()`. Reusing an IV with AES is bad practice and weakens the security, so generating a fresh random one every time ensures even identical notes look completely different when encrypted. The IV is saved to the database along with the note.

### 3. Auth Tag Protection
AES-GCM automatically spits out an Authentication Tag when it encrypts something. When decrypting, the Web Crypto API verifies this tag. If a bit is flipped or the encrypted text is modified in the database, the tag check fails, and it throws a decryption error. This prevents tampering.

### 4. Security Limitations
Currently, the frontend uses a shared key from the `.env` file (`VITE_ENCRYPTION_KEY`) for everyone. In a real-world app, this is insecure. The encryption key should ideally be derived dynamically from the user's login password (e.g., using PBKDF2 or Argon2) so every single user has their own unique encryption key that the backend never sees.

---

## AI Usage Log

I used AI tools (like ChatGPT and Claude) to help speed up this assignment:
- Generated the Vite + Tailwind CSS + shadcn boilerplate since configuring those from scratch is tedious.
- Used it to learn how the Web Crypto API expects ArrayBuffers to be sliced and handled for AES-GCM tags.
- Debugged some React Query caching and invalidation logic during the frontend refactor.
- Generated UI component structures for the Dashboard.

The actual integration, routing, auth middleware, and E2EE logic were manually assembled, customized, and cleaned up to meet the assignment requirements.

---

## Security Details

- **In-Memory JWT Storage**: The JWT token lives in React state memory, not `localStorage`. This helps mitigate basic XSS token theft. If you refresh the page, you have to log in again.
- **Password Hashing**: User passwords are salted and hashed with `bcryptjs` (10 rounds) before hitting MongoDB.
