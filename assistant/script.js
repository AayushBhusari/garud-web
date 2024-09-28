// Array of question-answer pairs
const questionAnswerPairs = [
  {
    question: "update",
    answer:
      "GARUD G is online and fully operational. How can I assist you further?",
  },
  {
    question: "location",
    answer: "Current location is coordinates 25.2048° N, 55.2708° E.",
  },
  {
    question: "threats detected",
    answer: "No suspicious activity detected in the monitored area.",
  },
  {
    question: "camera active",
    answer: "Yes, the camera is currently active and monitoring the region.",
  },
  {
    question: "battery status",
    answer: "Battery is at 85%, functioning optimally for surveillance.",
  },
  {
    question: "activate night vision",
    answer: "Night vision has been activated.",
  },
  {
    question: "humans detected",
    answer: "Detected 2 suspicious individuals near the border.",
  },
  {
    question: "radio frequency",
    answer: "Radio frequency is stable at 2.4 GHz.",
  },
  {
    question: "last detected location",
    answer:
      "The last location was 25.7617° N, 80.1918° W, near the south border.",
  },
  {
    question: "latest camera image",
    answer: "Displaying the most recent image from the camera.",
  },
  {
    question: "patrol status",
    answer: "Currently patrolling Sector B. No threats detected so far.",
  },
  {
    question: "suspicious activity",
    answer: "No suspicious activity detected in the last hour.",
  },
  {
    question: "deactivate night vision",
    answer: "Night vision has been deactivated.",
  },
  {
    question: "patrol continue",
    answer:
      "Based on current battery levels, patrolling can continue for another 3 hours.",
  },
  {
    question: "sector patrolled",
    answer: "Currently patrolling Sector C.",
  },
  {
    question: "GPS coordinates",
    answer: "GPS coordinates are 28.7041° N, 77.1025° E.",
  },
  {
    question: "system health",
    answer:
      "All systems are functional, with battery at 90% and stable signals.",
  },
];

// Function to update the chat box with messages
const updateChatBox = (sender, message) => {
  const chatBox = document.getElementById("chatBox");
  const messageElement = document.createElement("div");
  messageElement.className = sender;
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
};

// Function to handle user input
const getUserInput = () => {
  let userInput = document.getElementById("userUtterance").value;
  if (userInput === "") {
    alert("Please input something ......");
  } else {
    updateChatBox("user", userInput);
    document.getElementById("userUtterance").value = "";
    getBotResponse(userInput);
  }
};

// Function to get bot response based on keyword matching
const getBotResponse = (userInput) => {
  const userMessage = userInput.toLowerCase(); // Make the user input case-insensitive
  let responseFound = false;

  // Iterate through the question-answer pairs
  for (let i = 0; i < questionAnswerPairs.length; i++) {
    if (userMessage.includes(questionAnswerPairs[i].question.toLowerCase())) {
      updateChatBox("bot", questionAnswerPairs[i].answer);
      responseFound = true;
      break; // Exit loop once a match is found
    }
  }

  if (!responseFound) {
    // If no keyword match is found, provide a default response
    updateChatBox("bot", "Sorry, I don't understand that command.");
  }
};

// Add Event Listener
document.getElementById("sendButton").addEventListener("click", getUserInput);
document.getElementById("userUtterance").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getUserInput();
  }
});
