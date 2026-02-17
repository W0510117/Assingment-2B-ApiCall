///alert("Welcome to API CALL Assignment!");

document.getElementById("loadCats").addEventListener("click", () => {
  const count = parseInt(document.getElementById("catCount").value);
  const container = document.getElementById("cats");

  ///important to clear previous images
  container.innerHTML = "";

  ///loops to get a random picture
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

///selects a random status code from a predefined list
function getRandomStatusCode() {
  const codes = [200, 201, 301, 302, 400, 401, 403, 404, 500];
  return codes[Math.floor(Math.random() * codes.length)];
}


/// Poker Hand Code
(function () {

  let deckId = null;

  ///getting a new shuffled deck from the API
  async function getDeck() {
    const res = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1" ///shuffle a new deck by default
    );
    ///extracting deck ID from response
    const data = await res.json();
    deckId = data.deck_id;
  }

  ///drawing 5 cards from the deck 
  async function drawPokerHand() {

    ///safe check to ensure we have a deck before drawing
    if (!deckId) await getDeck();

    const res = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=5` ///draw 5 cards
    );
    const data = await res.json();

    displayCards(data.cards);   
    evaluateHand(data.cards);   
  }

  ///display cards on the page
  function displayCards(cards) {

    const container = document.getElementById("pokerCards");
    container.innerHTML = "";

    ///loop through cards and create image for each with sizing and spacing
    cards.forEach(card => {
      const img = document.createElement("img");
      img.src = card.image;
      img.alt = card.code;
      img.style.width = "120px";
      img.style.margin = "5px";
      container.appendChild(img);
    });
  }

  ///determine poker hand ranking
  function evaluateHand(cards) {
  //convert values to numbers
  const values = cards.map(c => convertValue(c.value)).sort((a,b)=>a-b);
  //get suits
  const suits = cards.map(c => c.suit);
  ///flush
  const isFlush = suits.every(s => s === suits[0]);
  ///straight
  let isStraight = true;
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i-1] + 1) {
      isStraight = false;
      break;
    }
  }

  ///count duplicates
  const counts = {};
  for (let v of values) {
    counts[v] = (counts[v] || 0) + 1;
  }

  const countValues = Object.values(counts).sort((a,b)=>b-a);

  ///determine hand rank 
  let result = "High Card";

  if (isStraight && isFlush && values[0] === 10)
    result = "Royal Flush"; ///10♥ J♥ Q♥ K♥ A♥
  else if (isStraight && isFlush)
    result = "Straight Flush"; ///5♣ 6♣ 7♣ 8♣ 9♣
  else if (countValues[0] === 4)
    result = "Four of a Kind";
  else if (countValues[0] === 3 && countValues[1] === 2)
    result = "Full House";
  else if (isFlush)
    result = "Flush";
  else if (isStraight)
    result = "Straight";
  else if (countValues[0] === 3)
    result = "Three of a Kind";
  else if (countValues[0] === 2 && countValues[1] === 2)
    result = "Two Pair";
  else if (countValues[0] === 2)
    result = "One Pair";

  //display
  document.getElementById("pokerResult").textContent = result;

  ///celebration images
  const image = document.getElementById("pokerImage");
  //celebration
  if (result === "Royal Flush") {
    alert("Royal Flush!");
    image.src = "royalflush.png";
    image.style.width = "300px";
    image.style.height = "200px";
  } else if (result === "Straight Flush") {
    alert("Straight Flush!");
    image.src = "straightflush.png"; 
    image.style.width = "300px";
    image.style.height = "200px";
  }
}

  ///if want to play again
  function playAgain() {
    deckId = null;
    document.getElementById("pokerCards").innerHTML = "";
    document.getElementById("pokerResult").textContent = "";

    ///clear celebration image to not break the flow of the game
    const image = document.getElementById("pokerImage");
    image.src = ""; ///clear image 
    image.style.display = "none"; ///hide the box
  }

  function convertValue(v) {
    if (v === "ACE") return 14;
    if (v === "KING") return 13;
    if (v === "QUEEN") return 12;
    if (v === "JACK") return 11;
    return parseInt(v);
  }



  ///button event listener
  document
    .getElementById("drawPoker")
    .addEventListener("click", drawPokerHand);
  document
    .getElementById("resetPoker")
    .addEventListener("click", playAgain);
})();