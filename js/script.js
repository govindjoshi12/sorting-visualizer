//Array
let array = [];
var barContainer = null;
var barArr = null;
var sorter = null;

//Bar Properties
var heightMult = null;
var barWidth = null;
var margin = null;

// Array and Animation Properties
const ARRAY_SIZE = 100;
const MIN_NUM = 35;
const MAX_NUM = 1000;
const ANIM_SPEED = 4; //setTimeout minimum is 4ms

window.onload = initialize;

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
    if(barWidth > 30)  
        arrayBar.textContent = magnitude;
    //Style
    arrayBar.style.textAlign = "center";
    arrayBar.style.height = magnitude * heightMult + "px";
    arrayBar.style.width = barWidth;
    arrayBar.style.margin = margin;
    return arrayBar;
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
        setTimeout(animate, ANIM_SPEED);
    }
}

function disableButtons(bool) {
    let buttons = document.getElementsByClassName("button");
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = bool;
    }
}

function removeSortedClass() {
    for(let i = 0; i < barArr.length; i++) {
        barArr[i].classList.remove("sorted-bar");
    }
}

//Simple Sorts
function* selectionSort() {
    disableButtons(true);
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
    disableButtons(false);
}
//Interrupting sort (by clicking randomize) doesn't stop animation, even though
//array is still randomized...?

function* insertionSort() {
    disableButtons(true);
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
    disableButtons(false);
}

function* bubbleSort() {
    disableButtons(true);
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
    disableButtons(false);
}

//Complex Sorts
function mergeSort() {
    mergeSortHelper(0, array.length - 1);
    renderVisualizer();
    console.log(array);
}

function mergeSortHelper(start, end) {
    if(start < end) {
        let mid = Math.floor((start + end) / 2);
        mergeSortHelper(start, mid);
        mergeSortHelper(mid + 1, end);
        merge(start, mid, end);
    }
 }


function* iterativeMergeSort() {
    let n = array.length;
    // For current size of subarrays to 
    // be merged curr_size varies from  
    // 1 to n/2 
    let curr_size;                   
    // For picking starting index of  
    // left subarray to be merged 
    let start;  
    // Merge subarrays in bottom up  
    // manner. First merge subarrays  
    // of size 1 to create sorted  
    // subarrays of size 2, then merge 
    // subarrays of size 2 to create  
    // sorted subarrays of size 4, and 
    // so on. 
    for (curr_size = 1; curr_size <= n-1; curr_size = 2*curr_size) {        
        // Pick starting point of different 
        // subarrays of current size 
        for (start = 0; start < n-1; start += 2*curr_size) { 
            // Find ending point of left  
            // subarray. mid+1 is starting  
            // point of right 
            let mid = Math.min(start + curr_size - 1, n-1); 
            let end = Math.min(start + 2*curr_size - 1, n-1); 
        
            // Merge Subarrays arr[left_start...mid] 
            // & arr[mid+1...right_end] 
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
                barArr[start + p1].classList.add("checking-bar");
                barArr[mid + 1 + p2].classList.add("checking-bar");
                yield;
                barArr[start + p1].classList.remove("checking-bar");
                barArr[mid + 1 + p2].classList.remove("checking-bar");

                if(arr1[p1] < arr2[p2]) {
                    array[idx] = arr1[p1];
                    barArr[idx] = generateArrayBar(arr1[p1]);
                    p1++;
                } else {
                    array[idx] = arr2[p2];
                    barArr[idx] = generateArrayBar(arr2[p2]);
                    p2++;
                }
                barArr[idx].classList.add("sorted-bar");
                yield;
                idx++;
            }
        
            while(p1 < len1) {
                array[idx] = arr1[p1];
                barArr[idx] = generateArrayBar(arr1[p1]);
                barArr[idx].classList.add("sorted-bar");
                yield;
                p1++;
                idx++;
            }
            while(p2 < len2) {
                array[idx] = arr2[p2];
                barArr[idx] = generateArrayBar(arr1[p1]);
                barArr[idx].classList.add("sorted-bar");
                yield;
                p2++;
                idx++;
            }
        } 
    }
    renderVisualizer();
    console.log(array);
}