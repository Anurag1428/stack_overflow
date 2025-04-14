
# DevEcho

DevEcho is a community-driven Q&A platform built specifically for developers. Inspired by Stack Overflow, it enables users to ask technical questions, provide answers, and collaboratively solve programming-related issues.

## 🌐 Live Website
[https://devecho.anurag.works/](https://devecho.anurag.works/)

## 🧠 Purpose

The primary goal of DevEcho is to create a helpful and inclusive community for developers where they can:
- Ask and answer technical questions.
- Share knowledge and upskill themselves.
- Engage with like-minded tech enthusiasts.

## 🚀 Features

- Ask and answer programming-related questions.
- Tag-based filtering and search system.
- Vote on questions and answers.
- Rich-text editing for questions/answers using TinyMCE.
- User authentication and profile management with Clerk.
- Real-time database interaction and updates.
- Integrated ChatGPT (GenAI) for enhanced suggestions.

## 🛠️ Technologies Used

- **Next.js** – React framework for frontend and SSR
- **Clerk** – Authentication and user management
- **MongoDB** – NoSQL database for storing user content
- **ShadCN** – UI components
- **Tailwind CSS** – Utility-first CSS framework
- **TinyMCE** – WYSIWYG text editor
- **Prisma** – ORM for database interaction and rich formatting
- **OpenAI / ChatGPT** – AI assistance for smart recommendations

![image](https://github.com/user-attachments/assets/09b927af-664a-4e66-b46e-1bf1e1f22b24)


## 👤 Who Can Use?

Anyone is welcome to use DevEcho to ask and answer questions. It is especially tailored for individuals with a technical background, such as:
- Web Developers
- Backend Developers
- Full-stack Engineers
- Tech Students & Professionals

## 📂 Repository

GitHub: [https://github.com/Anurag1428/stack_overflow](https://github.com/Anurag1428/stack_overflow)

---

Crafted with 💻 by **Anurag1428**


## 🧩 Installation & Setup

Follow the steps below to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Anurag1428/stack_overflow.git
cd stack_overflow
```

### 2. Install Dependencies

Make sure you have **Node.js** and **npm** installed. Then run:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your environment variables (Clerk API keys, MongoDB URI, etc.):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
MONGODB_URI=your_mongodb_connection
OPENAI_API_KEY=your_openai_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to see the app in action.

---

## 🧪 Testing (Optional)

To run any available tests (if implemented):

```bash
npm run test
```

---

Happy coding! 🚀
