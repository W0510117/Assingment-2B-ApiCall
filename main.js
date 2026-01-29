alert("Welcome to finding you favorite cat pictures!");



document.getElementById("loadCats").addEventListener("click", () => {
  const count = parseInt(document.getElementById("catCount").value);
  const container = document.getElementById("cats");

  ///important to clear previous images
  container.innerHTML = ""; 

  for (let i = 0; i < count; i++) {
    const statusCode = getRandomStatusCode();

    const img = document.createElement("img");
    img.src = `https://http.cat/${statusCode}`;
    img.alt = `HTTP ${statusCode} cat`;
    img.style.width = "200px";
    img.style.margin = "10px";

    container.appendChild(img);
  }
});

// selects a random status code from a predefined list
function getRandomStatusCode() {
  const codes = [200, 201, 301, 302, 400, 401, 403, 404, 500];
  return codes[Math.floor(Math.random() * codes.length)];
}
