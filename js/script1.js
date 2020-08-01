let array = [];
const ARRAY_SIZE = 10;
const MIN_NUM = 5;
const MAX_NUM = 500;

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

//Sorts
function selectionSort() {
    var len = array.length;
    for(var i = 0; i < len - 1; i++) {
        var minIndex = i;
        for(var j = i + 1; j < len; j++) {
            if(array[j] < array[minIndex])
                minIndex = j;
        }
        var temp = array[minIndex];
        array[minIndex] = array[i];
        array[i] = temp;
    }
    renderVisualizer();
}

//Inefficient setTimeout animation
function selectionSortAnimated() {
    let barArr = document.getElementById("bar-container").childNodes;
    let len = array.length;
    for(let i = 0; i < len - 1; i++) {
        
        let minIndex = i;

        barArr[i].style.backgroundColor = "red";

        for(let j = i + 1; j < len; j++) {
            if(array[j] < array[minIndex])
                minIndex = j;
            
            setTimeout(() => {
                barArr[j].style.backgroundColor = "red";
            }, ANIM_SPEED * i * j);
            setTimeout(() => {
                barArr[j].style.backgroundColor = "gray";
            }, ANIM_SPEED * i  * (j + 1));
        }

        barArr[i].style.backgroundColor = "gray";

        let temp = array[minIndex];
        array[minIndex] = array[i];
        array[i] = temp;

        let tempNode = barArr[minIndex];
        barArr[minIndex] = barArr[i];
        barArr[i] = tempNode;
    }
    console.log(array);
}

const ANIM_SPEED = 150;
function highlightBars() {
    let barArr = document.getElementById("bar-container").childNodes;
    for(let i = 0; i < barArr.length; i++) {
        setTimeout(() => {
            barArr[i].style.backgroundColor = "red";
        }, ANIM_SPEED * i);
        setTimeout(() => {
            barArr[i].style.backgroundColor = "gray";
        }, ANIM_SPEED * (i+1));
        //setTimeout is "non-blocking" so the moment setTimeout is called, 
        //the next iteration of the loop commences, and the code inside
        //that timer function executes once that timer ends. Thus, there is 
        //no "animation" since all setTimeout calls happen in rapid succession, 
        //and the code inside executes *timeout* later
        //Using 1000 * i gives the desired result, but it calls a setTimeout
        //function for EACH iteration... very inefficient. Other way?
    }
}