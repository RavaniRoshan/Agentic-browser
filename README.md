# Agentic Browser Plugin WebApp using GPT-OSS 20B

This project is an agentic browser automation platform that leverages the power of Large Language Models to perform tasks on the web. It uses a Python (FastAPI, Playwright) and Node.js (NestJS) backend, with a Next.js and Tailwind CSS frontend. The core reasoning and automation brain is powered by the OpenAI GPT-OSS 20B model via Hugging Face Transformers.

## 🟣 Project Agent Prompt for Bolt

This project is developed in collaboration with AI agents. The core principles and instructions for these agents are defined in `bolt.md`.

- **Your goals are:**
  - Help build and improve an agentic browser automation platform using a Python (FastAPI, Playwright) + Node.js (NestJS) tech stack.
  - Integrate the OpenAI GPT-OSS 20B model as the core reasoning and automation brain, using Hugging Face Transformers.
  - Deploy and orchestrate systems using Docker, Neon (or Supabase), and front-end via Next.js/Tailwind on Vercel or Render.com.

## Core Features

*   **Agentic Browsing:** Automate browser tasks using natural language instructions.
*   **AI-Powered Reasoning:** Utilizes the GPT-OSS 20B model for intelligent task execution.
*   **Modern Tech Stack:** Built with a robust and scalable combination of Python, Node.js, and Next.js.
*   **Containerized Deployment:** Uses Docker for consistent development and production environments.
*   **Cloud-Native Database:** Leverages Neon or Supabase for data persistence.

## Tech Stack

### Backend
*   **Python:**
    *   **FastAPI:** High-performance web framework for building APIs.
    *   **Playwright:** For reliable end-to-end browser automation.
*   **Node.js:**
    *   **NestJS:** A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
*   **AI Model:**
    *   **GPT-OSS 20B:** The core reasoning engine.
    *   **Hugging Face Transformers:** For integrating and serving the model.

### Frontend
*   **Next.js:** React framework for production.
*   **Tailwind CSS:** A utility-first CSS framework.

### Infrastructure
*   **Docker:** For containerization.
*   **Neon / Supabase:** Managed PostgreSQL database.
*   **Vercel / Render.com:** For frontend deployment.

## Getting Started

### Prerequisites

*   Node.js
*   Python
*   Docker
*   Access to a Neon or Supabase database.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/agentic-browser-plugin.git
    cd agentic-browser-plugin
    ```

2.  **Set up backend services:**
    *   Navigate to the backend directory (`cd backend`).
    *   Install Python dependencies:
        ```bash
        pip install -r requirements.txt
        ```
    *   Set up your `.env` file with database credentials and other secrets.

3.  **Set up frontend service:**
    *   Navigate to the frontend directory (`cd frontend`).
    *   Install Node.js dependencies:
        ```bash
        npm install
        ```
    *   Set up your `.env.local` file with the necessary API keys and backend URLs.

### Running the Application

You can run the entire application stack using Docker Compose:

```bash
docker-compose up --build
```

Alternatively, you can run each service individually for development.

*   **Backend (Python):**
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
*   **Backend (Node.js):**
    ```bash
    npm run start:dev
    ```
*   **Frontend:**
    ```bash
    npm run dev
    ```

## Running Tests

To run the test suite for the backend and frontend, use the following commands:

*   **Backend (Python):**
    ```bash
    pytest
    ```
*   **Backend (Node.js):**
    ```bash
    npm test
    ```
*   **Frontend:**
    ```bash
    npm test
    ```

## Deployment

The frontend is designed for deployment on Vercel or Render.com. The backend services can be deployed as Docker containers on any cloud provider that supports them (e.g., AWS, Google Cloud, Azure).

Refer to the deployment guides for each platform for detailed instructions.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a pull request.

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
