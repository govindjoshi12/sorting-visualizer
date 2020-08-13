//Array
var array = [];
var barContainer = null;
var barArr = null;
var sorter = null;

//Bar Properties
var heightMult = null;
var barWidth = null;
var margin = null;

// Array and Animation Properties
var timeouts = [];
var ARRAY_SIZE = 100;
var MIN_NUM = 35;
var MAX_NUM = 500;
var ANIM_SPEED = 10; //setTimeout minimum is 4ms
const SWOOP_ANIM_SPEED = 4;

window.onload = initialize;

function updateSize() {
    let newSize = document.getElementById("arraySize").value;
    document.getElementById("sizeDisplay").textContent = newSize;
    ARRAY_SIZE = newSize;
    initialize();
}

function updateSpeed() {
    let newSpeed = document.getElementById("animSpeed").value;
    document.getElementById("speedDisplay").textContent = newSpeed;
    ANIM_SPEED = newSpeed;
}

function initialize() {
    array = [];
    barContainer = document.getElementById("bar-container");
    barArr = barContainer.childNodes;

    generateArray(ARRAY_SIZE);

    heightMult = barContainer.clientHeight / max_element;
    var temp = barContainer.clientWidth / array.length;
    barWidth = temp * 0.9;
    margin = temp * 0.05;

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

function getRandomInt(min, max) {
    //Wrong behavior: could return max + min
    //return Math.floor(Math.random() * Math.floor(max)) + min;

    //Correct behavior: 
    //Ensures that maximum number generated is "max" - "min"
    //and then "min" is added to ensure returned number not less than "min"
    return Math.floor(Math.random() * (max - min)) + min;
}

function renderVisualizer() {
    //Empties bar-container div
    while(barContainer.hasChildNodes()) {
        barContainer.removeChild(barContainer.lastChild);
    }

    //Creating array element bars
    for(var i = 0; i < array.length; i++) {
        barContainer.appendChild(generateArrayBar(array[i]));
    }
}

function generateArrayBar(magnitude) {
    var arrayBar = document.createElement("div");
    arrayBar.className = "array-bar"
    if(barWidth > 35)  
        arrayBar.textContent = magnitude;
    //Style
    arrayBar.style.textAlign = "center";
    arrayBar.style.height = magnitude * heightMult + "px";
    arrayBar.style.width = barWidth;
    arrayBar.style.margin = margin;
    return arrayBar;
}

function barHeight(magnitude) {
    return magnitude * heightMult + "px";
}

function sort(sortFunction) {
    removeSortedClass();
    sorter = sortFunction;
    //disableButtons(true);
    animate();
    //disableButtons(false);
}

function animate() {
    //Animate must also be an async func
    //Since await keyword only applies to
    //"Promise" objects, and all async functions
    //return a promise
    if(!sorter.next().done) {
        timeouts.push(setTimeout(animate, ANIM_SPEED));
    }
}

function stopAnimation() {
    for(let i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
}

function disableControls(bool) {
    let buttons = document.getElementsByClassName("button");
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = bool;
    }
    let other = document.getElementsByTagName("input");
    for(let i = 0; i < other.length; i++) {
        other[i].disabled = bool;
    }
}

function removeSortedClass() {
    for(let i = 0; i < barArr.length; i++) {
        barArr[i].classList.remove("sorted-bar");
    }
}

//Simple Sorts
function* selectionSort() {
    disableControls(true);
    for(let i = 0; i < array.length - 1; i++) {
        let min_idx = i;
        for(let j = i + 1; j < array.length; j++) {
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
        barArr[i].classList.add("sorted-bar");
        yield;
    }
    barArr[array.length - 1].classList.add("sorted-bar");
    disableControls(false);
}
//Interrupting sort (by clicking randomize) doesn't stop animation, even though
//array is still randomized...?

function* insertionSort() {
    disableControls(true);
    for(let i = 1; i < array.length; i++) {
        if(i + 1 < array.length)
            barArr[i+1].classList.add("checking-bar");
        let currIdx = i;
        for(; array[currIdx] < array[currIdx - 1] && currIdx > 0; currIdx--) {
            let temp = array[currIdx - 1];
            array[currIdx - 1] = array[currIdx];
            array[currIdx] = temp;

            barArr[currIdx].classList.add("swapping-bar");
            barArr[currIdx-1].classList.add("swapping-bar");
            yield;
            barContainer.insertBefore(barArr[currIdx], barArr[currIdx-1]);
            barContainer.insertBefore(barArr[currIdx-1], barArr[currIdx]);
            yield;
            barArr[currIdx].classList.remove("swapping-bar");
            barArr[currIdx-1].classList.remove("swapping-bar");
        }
        if(i + 1 < array.length) {
            yield;
            barArr[i+1].classList.remove("checking-bar");
        }
    }
    for(let i = 0; i < barArr.length; i++) {
        barArr[i].classList.add("sorted-bar");
        yield;
    }
    disableControls(false);
}

function* bubbleSort() {
    disableControls(true);
    for(let i = 0; i < array.length - 1; i++) {
        //After each iteration, i elements from the end of the array will be sorted
        let j = 0;
        for(; j < array.length - i - 1; j++) {
            barArr[j].classList.add("checking-bar");
            barArr[j+1].classList.add("checking-bar");
            yield;
            //Only swap if curr element is greater than next element
            if(array[j] > array[j+1]) {
                let temp = array[j];
                array[j] = array[j+1];
                array[j+1] = temp;

                barContainer.insertBefore(barArr[j], barArr[j+1]);
                barContainer.insertBefore(barArr[j+1], barArr[j]);

                barArr[j].classList.add("swapping-bar");
                barArr[j+1].classList.add("swapping-bar");
                yield;
                barArr[j].classList.remove("swapping-bar");
                barArr[j+1].classList.remove("swapping-bar");
            }
            barArr[j].classList.remove("checking-bar");
            barArr[j+1].classList.remove("checking-bar");
        }
       barArr[j].classList.add("sorted-bar");
    }
    barArr[0].classList.add("sorted-bar");
    disableControls(false);
}

//Complex Sorts
const animations = [];
function* mergeSort() {
    mergeSortHelper(0, array.length - 1);
    for(let i = 0; i < animations.length; i++) {
        //Using assumption that coloring will happen at even indicies
        //and "insertion" will happen at odd indicies
        if(i % 2 == 0) {
            let bar1 = animations[i][0];
            let bar2 = animations[i][1];
            try {
                barArr[bar1].classList.add("checking-bar");
                barArr[bar2].classList.add("checking-bar");
            } catch(error) {/* No op */}
            yield;
            try {
                barArr[bar1].classList.remove("checking-bar");
                barArr[bar2].classList.remove("checking-bar");
            } catch(error) {/* No op */}
        } else {
            //No need to swap any bars, just adjust height of sorted bar
            //based on current value in integer array
            let sortedIdx = animations[i];
            let sortedBar = barArr[sortedIdx];
            sortedBar.style.height = barHeight(array[sortedIdx]);
            yield;
        }
    }
    //Green Swoop
    for(let i = 0; i < barArr.length; i++) {
        barArr[i].classList.add("sorted-bar");
        yield;
    }
}

function mergeSortHelper(start, end) {
    if(start < end) {
        let mid = Math.floor((start + end) / 2);
        mergeSortHelper(start, mid);
        mergeSortHelper(mid + 1, end);
        merge(start, mid, end);
    }
 }


function merge(start, mid, end) {
    let len1 = mid - start + 1;
    let len2 = end - mid;

    let arr1 = [];
    let arr2 = [];
    for(let i = 0; i < len1; i++) {
        arr1[i] = array[start + i];
    }
    for(let i = 0; i < len2; i++) {
        arr2[i] = array[mid + i + 1];
    }

    let p1 = 0;
    let p2 = 0;
    let idx = start;
    while(p1 < len1 && p2 < len2) {
        //Coloring animation will be at even index,
        //"Insertion Animation" will be at odd index
        animations.push([start + p1, mid + 1 + p2]);
        if(arr1[p1] < arr2[p2]) {
            array[idx] = arr1[p1];
            animations.push(idx);
            p1++;
        } else {
            array[idx] = arr2[p2];
            animations.push(idx);
            p2++;
        }
        idx++;
    }

    while(p1 < len1) {
        array[idx] = arr1[p1];
        animations.push([start + p1, -1]);
        animations.push(idx);
        p1++;
        idx++;
    }
    while(p2 < len2) {
        array[idx] = arr2[p2];
        animations.push([-1, mid + 1 + p2]);
        animations.push(idx);
        p2++;
        idx++;
    }
}