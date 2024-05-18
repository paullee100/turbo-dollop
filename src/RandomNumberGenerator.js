const minInput = document.getElementById("min-range"),
      maxInput = document.getElementById("max-range"),
      inclusiveButton = document.getElementById("inclusive-button"),
      exclusiveButton = document.getElementById("exclusive-button"),
      counter = document.getElementById("counter"),
      output = document.getElementById("output")

function generateRandomNumber() {
    let min = parseInt(minInput.value, 10);
    let max = parseInt(maxInput.value, 10);

    if (min > max) {
        alert("Minimum number cannot be larger than maximum number!");
        return;
    }

    // [min, max]
    if (inclusiveButton.checked) {
        max++;
    }

    // (min, max)
    if (exclusiveButton.checked) {
        min++;
    }

    const rand = Math.floor(Math.random() * (max-min)) + min;
    counter.textContent = `Counter: ${(parseInt(counter.textContent.split(":")[1].trim(), 10) + 1)}`;
    output.textContent = rand;
}