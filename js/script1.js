const array = [];

window.onload = initialize;

function initialize() {
    generateArray(10);
    renderVisualizer();
}

function generateArray(arrSize) {
    for(var i = 0; i < arrSize; i++) {
        array.push(getRandomInt(5, 1000));
    }
}

function renderVisualizer() {
    for(var i = 0; i < array.length; i++) {
        var arrayBar = document.createElement("div");
        arrayBar.className = "array-bar"
        arrayBar.textContent = array[i];
        arrayBar.style.textAlign = "center";
        document.getElementById("bar-container").appendChild(arrayBar);
    }
}

function getRandomInt(min, max) {
    //Wrong behavior: could return max + min
    //return Math.floor(Math.random() * Math.floor(max)) + min;

    //Correct behavior: 
    //Ensures that maximum number generated is "max" - "min"
    //and then "min" is added to ensure returned number not less than "min"
    return Math.floor(Math.random() * (max - min)) + min;
}

//Sorts
function selectionSort() {
    
}