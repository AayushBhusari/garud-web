maptilersdk.config.apiKey = "5vtNIzBUTTkkAjywRroq";
const map = new maptilersdk.Map({
  container: "curr-loc",
  style: maptilersdk.MapStyle.STREETS,
  center: [16.62662018, 49.2125578],
  zoom: 14, // starting zoom
});

const ESP32_CAPTURE_URL = "http://192.168.186.199/capture";
const canvas = document.getElementById("videoFeed");
const processedCanvas = document.getElementById("processedFeed");
const ctx = canvas.getContext("2d");
const processedCtx = processedCanvas.getContext("2d");

async function detect(frame) {
  const response = await fetch(`${MODEL_ENDPOINT}/${VERSION}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: frame }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.predictions;
  } else {
    console.error(`Error: ${response.status} - ${response.statusText}`);
    return null;
  }
}

async function captureFrame() {
  const response = await fetch(ESP32_CAPTURE_URL);
  if (response.ok) {
    const blob = await response.blob();
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.onload = async () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Draw raw image on processed canvas
      processedCtx.drawImage(
        img,
        0,
        0,
        processedCanvas.width,
        processedCanvas.height
      );

      const predictions = await detect(imageData);
      drawBoxes(predictions);
    };
  } else {
    console.error(`Error: ${response.status} - ${response.statusText}`);
  }
}

function drawBoxes(predictions) {
  if (predictions) {
    predictions.forEach((obj) => {
      const { x, y, width, height, class: label } = obj;
      const startX = x - width / 2;
      const startY = y - height / 2;

      processedCtx.strokeStyle = "green";
      processedCtx.lineWidth = 2;
      processedCtx.strokeRect(startX, startY, width, height);
      processedCtx.fillStyle = "white";
      processedCtx.fillText(label, startX, startY > 10 ? startY - 5 : 10);
    });
  }
}

// Main loop to capture frames and perform detection
setInterval(captureFrame, 500); // Capture frame every 500 ms

// This function will populate the table
function populateTable(data) {
  const tableBody = document.querySelector("#data-table tbody");

  // Clear the existing rows
  tableBody.innerHTML = "";

  // Loop through the MongoDB data and append rows to the table
  data.forEach((row) => {
    const tr = document.createElement("tr");

    // Create cells
    const timeStampCell = document.createElement("td");
    timeStampCell.textContent = row["Time Stamp"];
    const detectedBodyCell = document.createElement("td");
    detectedBodyCell.textContent = row["Detected body"];

    // Append cells to the row
    tr.appendChild(timeStampCell);
    tr.appendChild(detectedBodyCell);

    // Append row to the table body
    tableBody.appendChild(tr);
  });
}

// Fetch data from your MongoDB API and call the populateTable function
async function fetchData() {
  try {
    const response = await fetch("http://localhost:8000/data");
    const data = await response.json();
    populateTable(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Fetch and display the data when the page loads
window.onload = fetchData;
