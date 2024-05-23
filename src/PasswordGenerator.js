const specialCharactersOption = document.getElementById("special-characters"),
      numbersOption = document.getElementById("numbers"),
      lowerCaseOnlyOption = document.getElementById("lower-case-only"),
      upperCaseOnlyOption = document.getElementById("upper-case-only"),
      numberOfCharacters = document.getElementById("number-of-characters"),
      numberOfCharactersLabel = document.getElementById("number-of-character-label"),

      generatedPassword = document.getElementById("text-generated-password"),
      copyGeneratedPassword = document.getElementById("copy-generated-password"),
      toolTipText = document.getElementById("tool-tip-text")

const specialCharacters = "!@#$%^&*()?";
const numbers = "1234567890";
const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generatePassword() {
    const choices = [];

    if (specialCharactersOption.checked) {
        choices.push(specialCharacters);
    }

    if (numbersOption.checked) {
        choices.push(numbers);
    }


    if (lowerCaseOnlyOption.checked) {
        choices.push(lowerCaseLetters);
        
    }
    
    if (upperCaseOnlyOption.checked) {
        choices.push(upperCaseLetters);

    }

    let password = "";

    for (let i = 0; i < parseInt(numberOfCharactersLabel.textContent, 10); i++) {
        const choice = Math.floor(Math.random() * choices.length);
        // console.log(choices[choice]);

        const char = choices[choice][Math.floor(Math.random() * choices[choice].length)];
        password += char;
    }

    generatedPassword.textContent = password;
}

numberOfCharactersLabel.textContent = numberOfCharacters.value;

numberOfCharacters.addEventListener("change", (e) => {
    numberOfCharactersLabel.textContent = e.currentTarget.value;

});

async function copyContent() {
    const content = generatedPassword.textContent;

    if (content === "____") {
        alert("error");
        return;
    }

    try {
        await navigator.clipboard.writeText(content);
        toolTipText.textContent = "Copied!";
        toolTipText.style.marginTop = '-60px';
        console.log("Content copied to clipboard: " + content);
    } catch(err) {
        console.error("Failed to copy: ", err);
    }
}

function resetText() {
    if (toolTipText.textContent !== 'Copy to clipboard' && toolTipText.textContent === 'Copied!') {
        toolTipText.textContent = 'Copy to clipboard';
        toolTipText.style.marginTop = '-80px';
    }
}

generatePassword();