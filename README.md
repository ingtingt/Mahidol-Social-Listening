# 📊 MUIC Social Listening Dashboard

**A comprehensive social media analytics platform designed to analyze, categorize, and visualize engagement data for Mahidol University International College (MUIC).**

This project utilizes a modern full-stack architecture containerized with Docker to provide insights into Facebook post performance, user sentiment, and content categorization.

---

## ✨ Features

- **Engagement Analytics:** Tracks and visualizes Reactions, Shares, and Comments across 91 unique posts.
- **Sentiment Analysis:** Categorizes content sentiment (Positive, Neutral, Negative) using automated data processing.
- **Content Categorization:** Automatically groups posts into categories (e.g., Announcements, Events, Promotions).
- **Data Ingestion Pipeline:** Custom TypeScript scripts to parse and merge raw JSON data with curated CSV datasets.
- **Interactive Dashboard:** Responsive UI built with Next.js and Tailwind CSS, featuring dynamic charts and metric cards.

---

## 🛠️ Tech Stack

This project is built using the following technologies:

### **Frontend & Framework**

- **[Next.js 14](https://nextjs.org/)**: The React framework for the web (App Router).
- **[React](https://react.dev/)**: JavaScript library for building user interfaces.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
- **[Recharts](https://recharts.org/)**: A composable charting library built on React components.
- **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icon library.

### **Backend & Database**

- **[Prisma ORM](https://www.prisma.io/)**: Next-generation Node.js and TypeScript ORM.
- **[PostgreSQL](https://www.postgresql.org/)**: Open Source Relational Database.

### **Infrastructure & Tools**

- **[Docker](https://www.docker.com/)**: Platform for developing, shipping, and running applications in containers.
- **[Papa Parse](https://www.papaparse.com/)**: Powerful CSV parser for JavaScript.
- **[Google Generative AI](https://ai.google.dev/)**: (Optional) Integration for AI-powered keyword/content analysis.

---

## 🚀 Deployment Instructions

Follow these steps to set up and run the application locally.

### 📋 Prerequisites

- **Docker Desktop** must be installed and running on your machine.
- (Optional) Node.js and npm if running outside of Docker.

### Step 1: Setup Environment

1.  **Clone or Unzip** the project folder.
2.  Create a file named `.env` in the root directory of the project.
3.  Copy and paste the following configuration into the `.env` file:

    ```env
    # Database Configuration (Internal Docker Network)
    DATABASE_URL="postgresql://postgres:password@db:5432/muic_db?schema=public"
    DIRECT_URL="postgresql://postgres:password@db:5432/muic_db?schema=public"

    # AI Configuration
    GOOGLE_API_KEY="[Insert Your Google API Key Here]"
    ```

### Step 2: Start the Application

1.  Open a terminal (Command Prompt, PowerShell, or Terminal) in the project folder.
2.  Run the following Docker Compose command to build and start the containers:

    ```bash
    docker compose up -d --build
    ```

    > **Note:** Wait a few moments for the containers `muic_dashboard_web` and `muic_dashboard_db` to fully initialize.

### Step 3: Load Data (CRITICAL) ⚠️

The database initializes in an empty state. You must run the ingestion script to populate it with the 91 curated posts and their associated comments from the CSV files.

1.  Run the following command in your terminal:

    ```bash
    docker exec -it muic_dashboard_web npm run load-data
    ```

2.  **Wait for the success messages:**
    - `✅ Loaded 91 valid posts from CSV.`
    - `Data ingestion finished. Successfully inserted 91 posts.`

### Step 4: Access the Dashboard

1.  Open your web browser.
2.  Navigate to: **[http://localhost:3000](http://localhost:3000)**
3.  The dashboard should now be live, displaying all posts, content, and sentiment analysis charts.

---

## 📂 Project Structure

```bash
├── frontEnd/
│   ├── prisma/                # Database Schema & Migrations
│   ├── public/                # Static assets (Images, Icons)
│   ├── scripts/               # Data Ingestion Scripts (loadAndMergeData.ts)
│   ├── src/
│   │   ├── app/               # Next.js App Router Pages
│   │   ├── components/        # Reusable UI Components
│   │   ├── lib/               # Utility functions & Prisma Client
│   ├── merged_facebook_sentiment_results.csv  # Curated Post Data
│   ├── Comment_rows.csv       # Curated Comment Data
│   ├── facebook_data.json     # Raw Data Fallback
│   ├── Dockerfile             # Docker Image Configuration
│   └── ...
├── docker-compose.yml         # Container Orchestration
└── README.md                  # Project Documentation
```

## 👤 Author

**Teetath Teerakij**

- **Student ID:** 6481221
- **Faculty:** Computer Engineering
- **Email:** teetath.tee@student.mahidol.edu
- **Personal-Email:** teetathteerakij@gmail.com

**Jinnaphat Guntawang**

- **Student ID:** 6481161
- **Faculty:** Computer Engineering
- **Email:** jinaphat.gun@student.mahidol.edu

**Pranai Tisayatikom**

- **Student ID:** 6481101
- **Faculty:** Computer Engineering
- **Email:** pranai.tis@student.mahidol.edu
