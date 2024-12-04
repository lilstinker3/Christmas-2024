const names = ["Sam", "Paul", "Clare", "Dad", "Mom", "Evan"];
const forbiddenPairs = [
    ["Paul", "Sam"],
    ["Evan", "Clare"],
    ["Dad", "Mom"],
];
let previousPairs = JSON.parse(localStorage.getItem("previousPairs")) || [];

function isValidPair(pair, currentPairs) {
    return (
        !forbiddenPairs.some(
            (forbidden) =>
                (pair[0] === forbidden[0] && pair[1] === forbidden[1]) ||
                (pair[0] === forbidden[1] && pair[1] === forbidden[0])
        ) &&
        !currentPairs.some(
            (pastPair) =>
                (pair[0] === pastPair[0] && pair[1] === pastPair[1]) ||
                (pair[0] === pastPair[1] && pair[1] === pastPair[0])
        )
    );
}

function drawNames() {
    const shuffledNames = [...names].sort(() => Math.random() - 0.5);
    const pairs = [];
    const currentPairs = [...previousPairs];

    for (let i = 0; i < shuffledNames.length; i++) {
        const giver = shuffledNames[i];
        let receiver = null;

        // Try to find a valid receiver
        for (const candidate of shuffledNames) {
            if (
                candidate !== giver && // Can't pair with themselves
                !pairs.some((pair) => pair.includes(candidate)) && // Not already a receiver
                isValidPair([giver, candidate], currentPairs) // Obey rules
            ) {
                receiver = candidate;
                break;
            }
        }

        if (!receiver) {
            // Restart if no valid pairing is found
            return drawNames();
        }

        pairs.push([giver, receiver]);
    }

    // Update previous pairs
    previousPairs = pairs;
    localStorage.setItem("previousPairs", JSON.stringify(previousPairs));
    return pairs;
}

document.getElementById("draw-button").addEventListener("click", () => {
    const pairs = drawNames();
    const pairsDiv = document.getElementById("pairs");
    pairsDiv.innerHTML = pairs.map((pair) => `<p>${pair[0]} 🎁 ${pair[1]}</p>`).join("");
    document.getElementById("message").textContent = "Six pairs successfully drawn!";
});
