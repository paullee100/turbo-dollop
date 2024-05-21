const inputItem = document.getElementById("item-input"),
      buttonItem = document.getElementById("item-button"),
      listOfItems = document.getElementById("list-of-items"),
      percentage = document.getElementById("percentage"),
      resultContainer = document.getElementById("result-container"),
      closeButton = document.getElementById("close-button"),
      dropdownButton = document.getElementById("dropdown-button"),
      dropdownMenu = document.getElementById("dropdown"),
      resultDiv = document.getElementById("result"),
      currentOption = document.getElementById("current-option")

let myChart = null;
let initialClick = false;

/**
 * 
 * 
 * 
 * @returns 
 */
function insertItem() {
    if (inputItem.value == '') {
        alert("No item");
        return;
    }

    if (dropdownMenu.children[1].firstElementChild.checked) {
        if (percentage.value == '') {
            alert("No percentage");
            return;
        }
        if (percentage.value > 100 || percentage.value[0] == '-') {
            alert("Invalid percentage! Must be between 1 and 100!");
            return;
        }
    }

    const newItem = document.createElement("li");
    if (dropdownMenu.children[1].firstElementChild.checked) {
        newItem.id = percentage.value / 100;
        percentage.value = '';
    }
    newItem.textContent = inputItem.value;
    inputItem.value = '';

    const eraseButton = document.createElement("button");
    eraseButton.textContent = 'X';
    eraseButton.addEventListener("click", () => removeItem(eraseButton));

    newItem.appendChild(eraseButton);
    listOfItems.appendChild(newItem);

    // Wheel
    const items = Array.from({ length: listOfItems.children.length}, (_, i) => listOfItems.children[i].textContent.slice(0, -1));
    const arr = [];

    for (let i = 0; i < items.length; i++) {
        arr.push(items[i])
    }
    let dataArray = [];
    if (dropdownMenu.children[1].firstElementChild.checked) {
        for (let i = 0; i < items.length; i++) {
            dataArray.push(listOfItems.children[i].id * 16);
        }
        
    } else {
        dataArray = Array(arr.length).fill(16)
    }

    generateWheel(arr, dataArray);
    spinTheWheel();
}

const rotation = (context) => {
    const totalData = context.chart.data.labels.length;
    const baseRotation = 45;
    const dataIndexRotation = context.dataIndex * (360 / totalData);
    return baseRotation + dataIndexRotation;
}

let spinButton = document.getElementById("spin-btn");
// Spinner Count
let count = 0;
// 100 rotations for animation and last rotation for result
let resultValue = 101;
// Display value based on the randomAngle
let valueGenerator = null;

/********************** Sample Wheel ***************************/
example = ["Yes","No","Yes","No","Yes","No","Yes","No"]        //
exampleDataArray = Array(example.length).fill(16)              //
generateWheel(example, exampleDataArray)                       //
spinTheWheel()                                                 //
/**************************************************************/

function generateWheel(wheelContents, dataArray) {
    const wheel = document.getElementById("wheel");
    
    // Size of each piece
    const data = dataArray;

    // Background color for each piece
    const pieColors = Array.from({ length: wheelContents.length}, (_, i) => i % 2 == 0 ? "#8b35bc": "#b163da");

    if (myChart != null) {
        myChart.destroy();
    }

    createChart(wheel, data, pieColors, wheelContents);
}

/**
 * 
 * 
 * 
 */
function createChart(wheel, data, pieColors, labels) {
    // Create chart
    myChart = new Chart(wheel, {
        // Plugin for displaying text on pie chart
        plugins: [ChartDataLabels],
        // Chart Type Pie
        type: "pie",
        data: {
            // Labels (values which are to be displayed on chart)
            // labels: Array.from({ length: wheelContents.length}, (_, i) => wheelContents[i].value),
            labels: labels,
            // Settings for dataset/pie
            datasets: [
                {
                    backgroundColor: pieColors,
                    data: data,
                },
            ],
        },
        options: {
            // Responsive chart
            rotation: 0, // 30
            responsive: true,
            animation: {duration: 0},
            plugins: {
                // hide legend
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label;
                        }
                    }
                },
                legend: {
                    display: false
                },
                // Display labels inside pie chart
                datalabels: {
                    color: "#ffffff",
                    formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                    font: {size: 24},
                    rotation: rotation,
                },
            },
        },
    });

    console.log(myChart.getDatasetMeta(0)._parsed);
    console.log(myChart.getDatasetMeta(0).total);
}

var confettiCount = 200;
var defaults = {
  origin: { y: 0.7 },
  colors: ["#8b35bc", "#b163da"]
};

function fire(particleRatio, opts) {
  confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(confettiCount * particleRatio)
  });
}

/**
 * 
 * 
 * 
 */
function spinTheWheel() {

    // Display value based on the randomAngle
    valueGenerator = () => {
        const angle = 180 / Math.PI;
        myChart.getDatasetMeta(0).data.forEach((datapoint, index) => {
            let netStartAngle = datapoint.startAngle * angle % 360;
            let netEndAngle = datapoint.endAngle * angle % 360;

            if (netStartAngle < 0) netStartAngle += 360;
            if (netEndAngle < 0) netEndAngle += 360;

            if (netStartAngle > netEndAngle) {
                resultContainer.style.display = 'flex';
                resultContainer.classList.replace("popin", "popout");
                resultDiv.textContent = myChart.config.data.labels[index];
                fire(0.25, {
                    spread: 26,
                    startVelocity: 55,
                  });
                  fire(0.2, {
                    spread: 60,
                  });
                  fire(0.35, {
                    spread: 100,
                    decay: 0.91,
                    scalar: 0.8
                  });
                  fire(0.1, {
                    spread: 120,
                    startVelocity: 25,
                    decay: 0.92,
                    scalar: 1.2
                  });
                  fire(0.1, {
                    spread: 120,
                    startVelocity: 45,
                  });
            }
        });
    };

    if (initialClick) {
        spinButton.removeEventListener("click", helperSpinButton);
    } else {
        initialClick = true;
    }
    
    // Start spinning
    spinButton.addEventListener("click", helperSpinButton);
}

/**
 * 
 * 
 * 
 */
function helperSpinButton() {
    this.disabled = true;
    buttonItem.disabled = true;

    // Generate random degrees to stop at
    let randomDegree = Math.floor(Math.random() * 356)+1;

    // Interval for rotation animation
    let rotationInterval = window.setInterval(() => {
        // Set rotation for piechart
        /*
        Initially to make the piechart rotate faster we set
        resultValue to 101 so it rotates 101 degrees at a time
        and this reduces by 1 with every count. Eventually on
        last rotation we rotate by 1 degree at a time.
        */
        myChart.options.rotation = myChart.options.rotation + resultValue;
        
        // Update chart with new values;
        myChart.update();

        // If rotation > 360 reset it back to 0
        if (myChart.options.rotation >= 360) {
            count += 1;
            resultValue -= 5;
            myChart.options.rotation = 0;
        } else if (count > 15 && myChart.options.rotation == randomDegree) {
            valueGenerator();
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;
        }
    }, 10);
}

/**
 * 
 * 
 * 
 * @param {*} itemButton 
 */
function removeItem(itemButton) {
    itemButton.parentElement.remove();
    const arr = Array.from(listOfItems.children, ({ textContent}) => textContent.slice(0, -1));
    let dataArray = [];

    if (dropdownMenu.children[1].firstElementChild.checked) {

        for (let i = 0; i < listOfItems.children.length; i++) {
            dataArray.push(listOfItems.children[i].id);
        }
    } else {
        dataArray = Array(arr.length).fill(16)
    }

    generateWheel(arr, dataArray); // TODO: PUT DATA ARRAY
}

// Event Listeners
/**
 * 
 * 
 * 
 */
document.addEventListener("keydown", function(e) {
    if (e.key == "Enter") {
        insertItem();
    };
})

resultContainer.addEventListener("animationend", () => {
    // if (resultContainer.classList.contains("popout")) {
        fire(0.25, {
            spread: 26,
            startVelocity: 55,
          });
          fire(0.2, {
            spread: 60,
          });
          fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
          });
          fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
          });
          fire(0.1, {
            spread: 120,
            startVelocity: 45,
          });
    // }
})

closeButton.addEventListener("click", () => {
    resultContainer.classList.replace("popout", "popin");
    // resultContainer.addEventListener("animationend", () => {
        // if (resultContainer.classList.contains("popin")) {
            resultContainer.style.display = 'none';
            spinButton.disabled = false;
            buttonItem.disabled = false;

            if (dropdownMenu.children[0].firstElementChild.checked) {
                for (let i = 0; i < listOfItems.children.length; i++) {
                    if (listOfItems.children[i].textContent.slice(0,-1) == resultDiv.textContent) {
                        listOfItems.children[i].remove();
                        const arr = Array.from(listOfItems.children, ({ textContent}) => textContent.slice(0, -1));
                        generateWheel(arr); // TODO: PLACE DATAARRAY
                        break;
                    }
                }
            }
        // }
    // });
});

const toggleDropdown = function() {
    dropdownMenu.classList.toggle("show");
}

dropdownMenu.childNodes.forEach(element => {
    element.addEventListener("click", () => {
        element.firstElementChild.checked = true;
        currentOption.textContent = element.children[1].textContent;

        // TODO: USER MUST RELOAD PAGE IF LIST CONTAINS DATA.
        if (element.classList.contains("different_probability")) {
            percentage.style.display = 'flex';
        } else {
            percentage.style.display = 'none';
        }
    });
});

dropdownButton.addEventListener("click", function(e) {
    e.stopPropagation();
    toggleDropdown();
});

document.documentElement.addEventListener("click", function() {
    if (dropdownMenu.classList.contains("show")) {
        toggleDropdown();
    }
});