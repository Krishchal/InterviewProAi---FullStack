// import { useEffect, useState } from "react";
// import "./Reports.css"; // Importing the CSS file

// const Report = () => {
//   const [allMessages, setAllMessages] = useState([]); // Raw messages from backend
//   const [sessions, setSessions] = useState([]); // Grouped messages by session
//   const [selectedSessionIndex, setSelectedSessionIndex] = useState(0); // Currently selected session

//   // Fetch messages when the component loads
//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {
//     const email = localStorage.getItem("loggedInEmail");
//     try {
//       const response = await fetch(
//         `http://localhost:8010/api/messages/processed-messages?email=${email}`
//       );
//       const data = await response.json();
//       if (data.success) {
//         setAllMessages(data.messages);
//         groupMessagesIntoSessions(data.messages); // Organize into sessions
//       } else {
//         console.error("Failed to fetch messages");
//       }
//     } catch (err) {
//       console.error("Error fetching messages:", err.message);
//     }
//   };

//   // Helper function to group messages into sessions
//   const groupMessagesIntoSessions = (messages) => {
//     const grouped = [];
//     for (let i = 0; i < messages.length; i += 5) {
//       grouped.push(messages.slice(i, i + 5)); // Group in chunks of 5 messages
//     }
//     setSessions(grouped);
//   };

//   return (
//     <div className="reports-container">
//       <h1 className="header">Processed Messages</h1>

//       {/* Session Selector */}
//       <div className="session-selector">
//         <label htmlFor="session-select" className="label">
//           Select Session:
//         </label>
//         <select
//           id="session-select"
//           onChange={(e) => setSelectedSessionIndex(Number(e.target.value))}
//           className="dropdown"
//         >
//           {sessions.map((_, index) => (
//             <option key={index} value={index}>
//               Session {index + 1}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Display Messages for Selected Session */}
//       {sessions.length > 0 && sessions[selectedSessionIndex] ? (
//         <ul className="list">
//           {sessions[selectedSessionIndex].map((message, index) => (
//             <li key={index} className="list-item">
//               <pre className="pre">{JSON.stringify(message, null, 2)}</pre>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="no-data">No messages to display</p>
//       )}
//     </div>
//   );
// };

// export default Report;

//-------------------------------------------------------------------------------
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ProgressBar from "@ramonak/react-progress-bar";
import { jsPDF } from "jspdf"; // Import jsPDF
import "./Reports.css";

const Report = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
  const [accuracyLevels, setAccuracyLevels] = useState([]);
  const [averageAccuracy, setAverageAccuracy] = useState(0);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const email = localStorage.getItem("loggedInEmail");
    try {
      const response = await fetch(
        `http://localhost:8010/api/messages/processed-messages?email=${email}`
      );
      const data = await response.json();
      if (data.success) {
        setAllMessages(data.messages);
        groupMessagesIntoSessions(data.messages);
        updateAccuracyLevels(data.messages);
        storeSession(data.messages); // Store session in localStorage
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (err) {
      console.error("Error fetching messages:", err.message);
    }
  };

  const storeSession = (messages) => {
    const sessionData = {
      messages,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem("sessionData", JSON.stringify(sessionData));
  };

  const loadSession = () => {
    const sessionData = JSON.parse(localStorage.getItem("sessionData"));
    if (sessionData) {
      const currentTime = new Date().getTime();
      if (currentTime - sessionData.timestamp <= 10 * 60 * 1000) {
        setAllMessages(sessionData.messages);
        groupMessagesIntoSessions(sessionData.messages);
        updateAccuracyLevels(sessionData.messages);
      } else {
        localStorage.removeItem("sessionData");
      }
    }
  };

  const groupMessagesIntoSessions = (messages) => {
    const grouped = [];
    for (let i = 0; i < messages.length; i += 5) {
      grouped.push(messages.slice(i, i + 5));
    }
    setSessions(grouped);
  };

  const updateAccuracyLevels = (messages) => {
    const accuracies = messages.map((msg) =>
      parseFloat(msg.report["Accuracy (%)"].toFixed(2))
    );
    setAccuracyLevels(accuracies);

    const average = (
      accuracies.reduce((sum, val) => sum + val, 0) / accuracies.length
    ).toFixed(2);
    setAverageAccuracy(average);
  };

  const getBarColor = (value) => {
    if (value <= 20) return "red";
    if (value <= 40) return "orange";
    if (value <= 60) return "lightblue";
    if (value <= 80) return "#91ff0084";
    return "#00ff37";
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    const sessionData = sessions[selectedSessionIndex];
    if (sessionData) {
      pdf.text(`Session ${selectedSessionIndex + 1} Report`, 10, 10);

      sessionData.forEach((message, index) => {
        pdf.text(`Q${index + 1}: ${message.question}`, 10, 20 + index * 20);
        pdf.text(`A${index + 1}: ${message.transcribed_text}`, 10, 30 + index * 20);
        pdf.text(`Accuracy: ${accuracyLevels[selectedSessionIndex * 5 + index]}%`, 10, 40 + index * 20);
      });

      pdf.text(`Average Accuracy: ${averageAccuracy}%`, 10, 60 + sessionData.length * 20);
      pdf.save(`Session_${selectedSessionIndex + 1}_Report.pdf`);
    }
  };

  return (
    <div className="reports-container">
      <h1 className="header">Processed Messages</h1>

      <div className="session-selector">
        <label htmlFor="session-select" className="label">
          Select Session:
        </label>
        <select
          id="session-select"
          onChange={(e) => setSelectedSessionIndex(Number(e.target.value))}
          className="dropdown"
        >
          {sessions.map((_, index) => (
            <option key={index} value={index}>
              Session {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="main-section">
        <div className="progress-section">
          {accuracyLevels
            .slice(selectedSessionIndex * 5, selectedSessionIndex * 5 + 5)
            .map((level, index) => (
              <div key={index} className="progress-container">
                <p>Result for Qn {index + 1}</p>
                <ProgressBar
                  completed={level}
                  bgColor={getBarColor(level)}
                  labelColor="#000"
                  customLabel={`${level}%`}
                />
              </div>
            ))}
        </div>
        <div className="circular-progress-container">
          <CircularProgressbar
            value={averageAccuracy}
            text={`${averageAccuracy}%`}
            styles={buildStyles({
              textColor: getBarColor(averageAccuracy),
              pathColor: getBarColor(averageAccuracy),
              trailColor: "#d6d6d6",
            })}
          />
        </div>
      </div>

      <div className="qa-section">
        <h2>Questions and Answers</h2>
        {sessions.length > 0 && sessions[selectedSessionIndex] ? (
          sessions[selectedSessionIndex].map((message, index) => (
            <div key={index} className="qa-item">
              <p><strong>Question {index + 1}:</strong> {message.question}</p>
              <p><strong>Answer:</strong> {message.transcribed_text}</p>
            </div>
          ))
        ) : (
          <p className="no-data">No data available for this session</p>
        )}
      </div>

      <button className="download-button" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
};

export default Report;
