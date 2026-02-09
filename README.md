# TamboBase: The Generative Admin Panel

> **Turn your Supabase database into a dynamic, effortless admin dashboard using natural language.**

![TamboBase Banner](https://img.shields.io/badge/Status-Beta-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_15_|_Tambo_SDK_|_Supabase-black?style=for-the-badge)

**TamboBase** is an AI-powered interface that builds itself in real-time. Instead of manually coding static admin views, charts, and tables, you simply chat with your database. The system understands your schema, executes secure SQL queries, and renders the perfect UI component (Charts, Kanban, Tables) for your data instantly.

---

## 🚀 Why TamboBase?

Traditional admin panels (like Retool or custom dashboards) require you to pre-define every view and write specific queries for every potential business question. 

**TamboBase is different.** It uses **Generative UI** to solve the "blank canvas" problem:
1.  **Zero Boilerplate:** You don't build pages; you ask questions.
2.  **Context Aware:** The AI knows your database structure automatically via the `listTables` tool.
3.  **Real-Time Construction:** It decides *on the fly* whether you need a Bar Chart, a Pie Chart, or a Kanban board.

##  Key Features

### 🔍 instant Discovery
New to a database? Just ask **"What tables are in my database?"**. TamboBase scans the schema and provides a summary without you ever looking at an ER diagram.

###  Generative Visualizations
Ask natural language questions to get rich, interactive UI components:
*   **"Show me monthly revenue as a bar chart"** -> Renders a Recharts Bar Graph.
*   **"Show users by region as a pie chart"** -> Renders a Pie Chart.
*   **"Show top performing products"** -> Renders a sorted Data Table.

###  Intelligent Kanban Boards
Have data with statuses? Ask **"Show me tasks grouped by status"**. TamboBase automatically groups your data and renders a drag-and-drop style Kanban board.

###  Admin Capabilities
It's not just read-only. You can perform schema migrations directly through chat:
*   **"Add a 'priority' column to the tasks table"**
*   **"Create a new table for customer feedback"**

---

##   Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **AI Orchestration:** [Tambo SDK](https://tambo.co/) (@tambo-ai/react)
*   **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
*   **Styling:** Tailwind CSS & Shadcn/UI
*   **Deployment:** Vercel

---

##   Getting Started

### 1. Prerequisites
*   A [Supabase](https://supabase.com/) project.
*   A [Tambo](https://tambo.co/) account and API Key.

### 2. Clone & Install
```bash
git clone https://github.com/yourusername/tambo-base.git
cd tambo-base
npm install
```

### 3. Environment Setup
Rename `example.env.local` to `.env.local` and add your keys:

```bash
# Tambo AI Key
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url
# Use the Service Role Key to allow the AI to perform queries and schema changes
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and start chatting with your database!

---

## 🧠 How It Works

1.  **User Prompt:** You ask "Show me sales by month."
2.  **Tambo Agent:** The AI analyzes the intent and calls the registered **Model Context Protocol (MCP)** tools defined in `src/lib/tambo.ts`.
3.  **SQL Execution:** The `querySupabase` tool generates a secure SQL query and executes it against your Supabase instance.
4.  **Component Selection:** The AI selects the best component (e.g., `<Graph />` or `<DataTable />`) to visualize the returned JSON data.
5.  **Streaming Render:** The UI streams to the client instantly.

---

## 🔒 Security Note
This project uses the `SUPABASE_SERVICE_ROLE_KEY` on the server-side to allow the AI agent to perform flexible database operations. Ensure extensive RLS (Row Level Security) policies are not blocking the necessary admin actions, or use this tool in a trusted internal environment.
