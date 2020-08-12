let array = [];
const ARRAY_SIZE = 20;
const MIN_NUM = 5;
const MAX_NUM = 1000;
const ANIM_SPEED = 50;
var sorter = null;

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

    var heightMult = barContainer.clientHeight / max_element;
    var temp = barContainer.clientWidth / array.length;
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

function sort(sortFunction) {
    sorter = sortFunction;
    //disableButtons(true);
    animate();
    //disableButtons(false);
}

function animate() {
    if(!sorter.next().done) {
        setTimeout(animate, ANIM_SPEED);
    }
}

function disableButtons(bool) {
    let buttons = document.getElementsByClassName("button");
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = bool;
    }
}

//Inefficient setTimeout animation
function* selectionSort() {
    disableButtons(true);
    let barContainer = document.getElementById("bar-container");
    let barArr = barContainer.childNodes;
    for(let i = 0; i < array.length - 1; i++) {
        let min_idx = i;
        for(let j = i + 1; j < array.length; j++) {
            // barArr[i].style.backgroundColor = "red";
            if(array[j] < array[min_idx]) {
                min_idx = j;
            }

            barArr[j].classList.add("checking-bar");
            yield;
            barArr[j].classList.remove("checking-bar");
        }

        let temp = array[min_idx];
        array[min_idx] = array[i];
        array[i] = temp;
 
        barContainer.insertBefore(barArr[i], barArr[min_idx]);
        barContainer.insertBefore(barArr[min_idx], barArr[i]);
        barArr[i].style.backgroundColor = "green"; 
        yield;
    }
    barArr[array.length - 1].style.backgroundColor = "green"; 
    disableButtons(false);
}
//Interrupting sort (by clicking randomize) doesn't stop animation, even though
//array is still randomized...?

function insertionSort() {
    // let barContainer = document.getElementById("bar-container");
    // let barArr = barContainer.childNodes;
    for(let i = 1; i < array.length; i++) {
        let currIdx = i;
        for(; array[currIdx] < array[currIdx - 1] && currIdx > 0; currIdx--) {
            let temp = array[currIdx - 1];
            array[currIdx - 1] = array[currIdx];
            array[currIdx] = temp;
        }
    }
    renderVisualizer();
    console.log(array);
}

function bubbleSort() {
    for(let i = 0; i < array.length - 1; i++) {
        //After each iteration, i elements from the end of the array will be sorted
        for(let j = 0; j < array.length - i - 1; j++) {
            //Only swap if curr element is greater than next element
            if(array[j] > array[j+1]) {
                let temp = array[j];
                array[j] = array[j+1];
                array[j+1] = temp;
            }
        }
    }
    renderVisualizer();
    console.log(array);
}