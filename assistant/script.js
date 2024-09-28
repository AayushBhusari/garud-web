import { GoogleGenerativeAI } from "@google/generative-ai";

// Maintain the conversation history
let conversationHistory = [];

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
  let userInput = document.getElementById("userInput").value;
  if (userInput === "") {
    alert("Please input something ......");
  } else {
    updateChatBox("user", userInput);
    document.getElementById("userInput").value = "";
    getBotResponse(userInput);
  }
};

// Function to get bot response
const getBotResponse = async (userInput) => {
  try {
    const API_KEY = "your_google_generative_ai_api_key";
    const genAI = new GoogleGenerativeAI(API_KEY);

    // Initialize the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    conversationHistory.push({ role: "user", parts: [{ text: userInput }] });

    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(userInput);
    const response = await result.response;
    const text = response.parts.map((part) => part.text).join(" ");
    updateChatBox("bot", text);

    conversationHistory.push({ role: "model", parts: [{ text: text }] });
  } catch (error) {
    console.error("Error getting bot response:", error);
    updateChatBox("bot", "Oops! Something went wrong. Please try again later.");
  }
};

// Add Event Listener
document.getElementById("sendButton").addEventListener("click", getUserInput);
document.getElementById("userInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getUserInput();
  }
});
