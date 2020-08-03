let array = [];
const ARRAY_SIZE = 100;
const MIN_NUM = 5;
const MAX_NUM = 1000;

window.onload = initialize;

function initialize() {
    array = [];
    generateArray(ARRAY_SIZE);
    renderVisualizer();
}

var max_element = MIN_NUM;
function generateArray(arrSize) {
    for(var i = 0; i < arrSize; i++) {
        var num = getRandomInt(MIN_NUM, MAX_NUM)
        array.push(num);
        max_element = num > max_element ? num : max_element;
    }
}

function renderVisualizer() {
    var barContainer = document.getElementById("bar-container");
    
    //Empties bar-container div
    while(barContainer.hasChildNodes()) {
        barContainer.removeChild(barContainer.lastChild);
    }

    var heightMult = barContainer.offsetHeight / max_element;
    var temp = barContainer.offsetWidth / array.length;
    var barWidth = temp * 0.9;
    var margin = temp * 0.05;
    //Creating array element bars
    for(var i = 0; i < array.length; i++) {
        var arrayBar = document.createElement("div");
        arrayBar.className = "array-bar"
        if(barWidth > 30)  
            arrayBar.textContent = array[i];
        //Style
        arrayBar.style.textAlign = "center";
        arrayBar.style.height = array[i] * heightMult + "px";
        arrayBar.style.width = barWidth;
        arrayBar.style.margin = margin;

        barContainer.appendChild(arrayBar);
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

//Inefficient setTimeout animation
function selectionSortAnimated() {
    var barContainer = document.getElementById("bar-container");
    var barArr = barContainer.childNodes;
    for(let i = 0; i < array.length - 1; i++) {
        let min_idx = i;
        for(let j = i + 1; j < array.length; j++) {
            // barArr[i].style.backgroundColor = "red";
            if(array[j] < array[min_idx]) {
                min_idx = j;
            }
        }

        var temp = array[min_idx];
        array[min_idx] = array[i];
        array[i] = temp;

        setTimeout(() => {   
            barContainer.insertBefore(barArr[i], barArr[min_idx])
            barContainer.insertBefore(barArr[min_idx], barArr[i]);
            barArr[i].style.backgroundColor = "green";
        }, i * 100);
    }
}
//Interrupting sort (by clicking randomize) doesn't stop animation, even though
//array is still randomized...?
