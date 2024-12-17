
# Automated Interview System - Full Stack Project

This is a Final year full-stack web application project for an **Automated Interview System**. 
Which streamline the interview process by Recommending the candidate expertise question, transcribing audio to text and comparision with pre-defined answerset and displaying the report to users
It comprises three main components:

1. **Client**: A React.js-based frontend.
2. **Backend (Node.js)**: RESTful API server built with Express.js.
3. **Backend (Flask)**: Python-based backend with Whisper AI model for audio streaming ,transcription and answer evaluation.

---

## Project Structure

```plaintext
authApp-backend/
├── client/               # React.js frontend
├── Flask/                # Python Flask backend
├── node/                 # Node.js backend (Express.js APIs)
└── README.md             # Documentation
```

---

## Requirements

Ensure the following tools are installed on your system:
- [Node.js](https://nodejs.org/) (v14+)
- [Python](https://www.python.org/) (v3.8+)
- [Pip](https://pip.pypa.io/en/stable/) (Python package manager)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Vite](https://vitejs.dev/) for fast React builds
- Stable internet connection for AI-based tasks

---

## Setup Instructions

Follow the steps below to set up the project.

### 1. Set up Flask Backend

1. Navigate to the `Flask/` directory:
    ```bash
    cd Flask
    ```
2. Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```
3. Run the Flask server:
    ```bash
    python app.py
    ```
4. The Flask server will run at `http://127.0.0.1:5000/`.

### 2. Set up Node.js Backend

1. Navigate to the `node/` directory:
    ```bash
    cd node
    ```
2. Install the required npm packages:
    ```bash
    npm install
    ```
3. Create a `.env` file in the `node/` directory using the example `.env-sample` file:
    ```bash
    cp .env-sample .env
    ```
4. Start the Node.js server:
    ```bash
    node index.js
    ```
5. The Node.js server will run at `http://127.0.0.1:3000/`.

### 3. Set up React Frontend

1. Navigate to the `client/` directory:
    ```bash
    cd client/interviewPro
    ```
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Start the React development server:
    ```bash
    npm run dev
    ```
4. The React app will run at `http://127.0.0.1:5173/`.

---

## Project Features

### Frontend (React.js)
- **User Authentication**: Sign-up and login functionality.
- **Dynamic Question Pages**: Based on categories (Frontend, Backend, DevOps, etc.).
- **Reports Section**: Displays evaluation results.
- **Responsive Design**: User-friendly and intuitive interface.

### Node.js Backend
- **APIs**: Handles user authentication, question recommendations, and audio processing routes.
- **Middleware**: Security via JWT and input validations.
- **Queue Integration**: Processes queued audio data using RabbitMQ.

### Flask Backend
- **Speech-to-Text Conversion**: Processes audio input using the **Whisper AI model**.
- **Answer Comparison**: Utilizes cosine similarity for evaluating candidate responses.
- **Transcriptions**: Returns transcribed text for further processing.

---

## How It Works

1. Users select interview categories and answer questions verbally.
2. Audio input is transcribed using **Whisper AI** in the Flask backend.
3. Transcribed text is evaluated against predefined answers using cosine similarity.
4. Scores and reports are generated and displayed on the frontend.

---

## API Endpoints

### Node.js Backend
| Method | Endpoint                     | Description                      |
|--------|-----------------------------|----------------------------------|
| POST   | `/api/auth/signup`          | User registration                |
| POST   | `/api/auth/login`           | User login                       |
| GET    | `/api/questions`            | Fetch recommended questions      |
| POST   | `/api/audio/upload`         | Upload user audio for processing |

### Flask Backend
| Method | Endpoint               | Description                         |
|--------|------------------------|-------------------------------------|
| POST   | `/transcribe`          | Transcribes audio to text           |
| POST   | `/evaluate`            | Evaluates transcribed answers       |

---

## Technologies Used

### Frontend
- React.js
- Vite
- HTML/CSS
- JavaScript

### Backend
- **Node.js**: Express.js for RESTful APIs
- **Flask**: Python backend with Whisper AI

### Additional Tools
- RabbitMQ: Queue management for audio processing
- JWT: Authentication
- Whisper AI: Speech-to-text transcription
- Cosine Similarity: Text comparison algorithm

---

## Future Enhancements

- **Multilingual Support**: Transcription and evaluation in multiple languages.
- **Resume Parsing**: Automate profile extraction from resumes.
- **Advanced AI Features**: Improve evaluation accuracy with ML models.

---

## Contributors

- Krishchal Regmi
- Sujan Basnet
- Sushant Regmi

---

## License

This project is licensed under the MIT License.
