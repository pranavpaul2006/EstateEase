# EstateEase

## The Problem
Navigating the real estate market can be an overwhelming, fragmented, and inefficient process. Buyers struggle to keep track of interesting properties across multiple platforms, while sellers and real estate agents lack a centralized hub to showcase listings, manage property inquiries, and schedule viewing appointments. This disconnect results in missed opportunities, disorganized communication, and a frustrating user experience for all parties involved.

## The Solution
EstateEase is a modern, full-stack real estate platform designed to streamline property buying, selling, and renting. It provides a centralized hub where users can browse high-quality property listings, save their favorites to a personal wishlist, and seamlessly schedule viewing appointments with sellers. With a clean, responsive UI and a robust backend handling complex database operations, EstateEase simplifies the real estate journey by bridging the gap between property seekers and providers in one intuitive application.

## Tech Stack
- **Programming Languages:** 
  - JavaScript
  - HTML/CSS
- **Frameworks:**
  - **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion (for animations)
  - **Backend:** Node.js, Express.js
- **Databases:**
  - PostgreSQL (via Supabase)
- **APIs & Third-Party Tools:**
  - **Authentication:** Supabase Auth
  - **Database & Storage:** Supabase (for relational data and property image storage)
  - **Other Libraries:** Axios (for HTTP requests), Multer (for file uploads), CORS

## Setup Instructions

Follow these steps to clone and run the project locally.

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- A **Supabase** account (for database and authentication setup)

### 2. Database Configuration
This project uses Supabase as its database. You will need to create a new Supabase project and set up the following:
1. Create a new project on [Supabase](https://supabase.com/).
2. You will need to configure the database schema for `properties`, `users`, `wishlists`, and `appointments`. *(Note: Run any provided SQL migrations or manually set up the schema based on the application's required tables).*
3. Obtain your **Project URL** and **Anon Public Key** from the Supabase dashboard (Project Settings > API).

### 3. Backend Setup

Open your terminal and run the following commands:

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend` directory based on the provided template:
   ```bash
   cp .env.example .env
   ```
   *Your `.env` file should look like this:*
   ```env
   # Server Configuration
   PORT=5000
   
   # Supabase Credentials (obtain from Supabase Dashboard -> Settings -> API)
   SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_public_key_here
   ```
   *Make sure to replace the placeholder values with your actual Supabase credentials.*

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   *The backend server should now be running on `http://localhost:5000`.*

### 4. Frontend Setup

Open a new terminal window/tab and run the following commands:

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `frontend` directory based on the provided template:
   ```bash
   cp .env.example .env
   ```
   *Your `.env` file should look like this:*
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:5000/api
   
   # Supabase Credentials (obtain from Supabase Dashboard -> Settings -> API)
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here
   ```
   *Replace the placeholder values with your Supabase credentials.*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The frontend application should now be accessible in your browser (typically at `http://localhost:5173`).*