const form = document.querySelector("form");
const resultsList = document.getElementById("resultsList");
const immediateResults = document.getElementById("resultMessage");
const apiUrl = "http://localhost:3023";
const historyUrl = `${apiUrl}/history`;
const simulateUrl = `${apiUrl}/simulate`;

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const guessNumbers = document.getElementById("guessNumbers");
  const guessPowerball = document.getElementById("guessPowerball");
  try {
    const response = await fetch(simulateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guessNumbers: guessNumbers.value
          .split(",")
          .map((num) => parseInt(num.trim())),
        guessPowerball: parseInt(guessPowerball.value),
      }),
    });
    const data = await response.json();
    if (data.error) {
      immediateResults.textContent = `Error: ${data.error.message || data.error}`;
      return;
    }
    const actualPowerball = data.lotteryData.powerballNumber;
    const actualLotteryNumbers = data.lotteryData.lotteryNumbers;
    const dateGenerated = data.lotteryData.dateGenerated;
    const matchedNumbers = data.matchedNumbers;
    const matchedPowerball = data.matchedPowerball;
    const prize = data.prize;

    const div = document.createElement("div");
    div.className = "resultEntry";
    div.innerHTML = `
            <h2>Your Recent Lottery Results</h2>
            <strong>Lottery Draw Date:</strong> ${new Date(dateGenerated).toLocaleString()}
            <strong>Your Guess:</strong> Numbers: [${guessNumbers.value}] Powerball: ${guessPowerball.value}
            <strong>Actual Numbers:</strong> Numbers: [${actualLotteryNumbers.join(", ")}] Powerball: ${actualPowerball}
            <strong>Matched Numbers:</strong> ${matchedNumbers} ${matchedPowerball ? " + Powerball" : ""}
            <strong>Prize Won:</strong> ${prize.toLocaleString()}
        `;
    // set display from none to block to show results, remove old results
    immediateResults.style.display = "block";
    immediateResults.textContent = "";
    immediateResults.appendChild(div);

    await loadHistory(); // refresh history
  } catch (error) {
    immediateResults.textContent = `Error: ${error}`;
  }
});

const loadHistory = async () => {
  try {
    const response = await fetch(historyUrl);
    const loadedData = await response.json();
    if (loadedData.error) {
      resultsList.innerHTML = `<li>Error: ${loadedData.error.message || loadedData.error}</li>`;
      return;
    }
    resultsList.innerHTML = "";
    for (const data of loadedData) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <strong>Date:</strong> ${new Date(data.lotteryData.dateGenerated).toLocaleString()}
                <strong>Guess:</strong> Numbers: [${data.userInput.guessNumbers.join(", ")}] Powerball: ${data.userInput.guessPowerball}
                <strong>Actual Numbers:</strong> Numbers: [${data.lotteryData.lotteryNumbers.join(", ")}] Powerball: ${data.lotteryData.powerballNumber}
                <strong>Matched Numbers:</strong> ${data.matchedNumbers} ${data.matchedPowerball ? " + Powerball" : ""}
                <strong>Prize Won:</strong> ${data.prize.toLocaleString()}
                <a href="${apiUrl}/data/${data.lotteryData.dateGenerated}.json" target="_blank">View JSON</a>
                <button class="deleteButton" data-filename="${data.lotteryData.dateGenerated}.json">Delete</button>
            `;
      resultsList.appendChild(listItem);
    }
  } catch (error) {
    resultsList.innerHTML = `<li>Error: ${error}</li>`;
  }
};

// Event delegation for delete buttons
resultsList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("deleteButton")) {
        const filename = event.target.getAttribute("data-filename");
        try {
            const response = await fetch(`${apiUrl}/data/${filename}`, {
                method: "DELETE",
            });
            if (response.ok) {
                // remove the item from the DOM and reload history
                event.target.closest('li').remove(); // use closest to find the parent li
                await loadHistory();
            } else {
                const text = await response.text();
                const result = text ? JSON.parse(text) : {};
                alert(`Error: ${result.error || 'Failed to delete'}`);
            }

            await loadHistory(); // Refresh the history list
        } catch (error) {
            alert(`Error: ${error}`);
        }
    }
});

// Load history on page load
document.addEventListener("DOMContentLoaded", loadHistory);