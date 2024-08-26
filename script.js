document.addEventListener("DOMContentLoaded", function () {
  const templateSelect = document.getElementById("template");
  const topTextInput = document.getElementById("top-text");
  const bottomTextInput = document.getElementById("bottom-text");
  const generateButton = document.getElementById("generate");

  fetch("https://api.imgflip.com/get_memes")
    .then((response) => response.json())
    .then((data) => {
      const memes = data.data.memes;
      memes.forEach((meme) => {
        const option = document.createElement("option");
        option.value = meme.id;
        option.textContent = meme.name;
        templateSelect.appendChild(option);
      });
    });

  generateButton.addEventListener("click", function (event) {
    event.preventDefault();

    const selectedMemeId = templateSelect.value;
    const topText = topTextInput.value;
    const bottomText = bottomTextInput.value;

    const formData = new URLSearchParams();
    formData.append("template_id", selectedMemeId);
    formData.append("text0", topText);
    formData.append("text1", bottomText);
    formData.append("username", "TestCheck");
    formData.append("password", "TestCheck");

    fetch("https://api.imgflip.com/caption_image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const memeUrl = data.data.url;
          const popupWindow = window.open("", "_blank", "width=600,height=600");
          popupWindow.document.write(`
            <html>
              <head>
                <title>Generated Meme</title>
              </head>
              <body>
              <link rel="stylesheet" href="styles.css">
                <center>
                  <img src="${memeUrl}" alt="Generated Meme"/>
                  <br>
                  <br>
                  <button id="download-meme">Download Meme</button>
                </center>
              </body>
              <script src="script.js"></script>
            </html>
          `);

          popupWindow.document
            .getElementById("download-meme")
            .addEventListener("click", function () {
              const link = document.createElement("a");
              link.href = memeUrl;
              link.download = "meme.jpg";
              link.click();
            });
        } else {
          alert("Failed to generate meme: " + data.error_message);
        }
      })
      .catch((error) => {
        alert("An error occurred while generating the meme.");
        console.error("Error:", error);
      });
  });
});
