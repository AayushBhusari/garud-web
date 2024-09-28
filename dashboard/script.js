maptilersdk.config.apiKey = "5vtNIzBUTTkkAjywRroq";
const map = new maptilersdk.Map({
  container: "curr-loc", // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.STREETS,
  center: [16.62662018, 49.2125578], // starting position [lng, lat]
  zoom: 14, // starting zoom
});

const API_KEY = "mDNDGcJvWw9SUfrZYyGu";
const MODEL_ENDPOINT = "https://detect.roboflow.com/human-detection-e45xq";
const VERSION = 1;
const ESP32_CAPTURE_URL = "http://192.168.186.199/capture"; // Update to your ESP32 camera URL
const canvas = document.getElementById("videoFeed");
const processedCanvas = document.getElementById("processedFeed"); // New processed canvas
const ctx = canvas.getContext("2d");
const processedCtx = processedCanvas.getContext("2d"); // Context for processed canvas

async function detect(frame) {
  const response = await fetch(`${MODEL_ENDPOINT}/${VERSION}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: frame }), // Use 'image' instead of 'imageData'
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
