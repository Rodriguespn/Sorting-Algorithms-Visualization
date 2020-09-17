// Enum
const algorithms = {
    BUBBLE: 1,
    SELECTION: 2,
    INSERTION: 3,
    QUICK: 4,
    MERGE: 5
}

const speed_modes = {
    SLOW: 1,
    NORMAL: 2,
    FAST: 3
}

// in miliseconds
const delay_time = {
    SLOW: 280,
    NORMAL: 200,
    FAST: 160,
    QS_SLOW: 1500,
    QS_NORMAL: 1000,
    QS_FAST: 500
}

const bar_colours = {
    initColour: "#3aafff",
    selectedColour: "#d849ff",
    selectedColour2: "#ff9e18",
    doneColour: "#13CE66",
    pivotColour: "#ff3a4d"
}
    
const canvas = document.querySelector(".data-container");

let sortingAlgo = algorithms.BUBBLE;
let active = false;
let delay = delay_time.NORMAL;
let qsDelay = delay_time.QS_NORMAL;


function getValue(htmlElement) {
    return Number(htmlElement.childNodes[0].innerHTML);
}

// Clears the blocks from the canvas
function clearCanvas() {
    while(canvas.firstChild) { 
        canvas.removeChild(canvas.firstChild); 
    } 
}

// generates new blocks on the canvas
function generateBlocks() {
    clearCanvas();

    num = canvas.clientWidth / 30 - 1;
    if (num && typeof num !== "number") {
        alert("First argument must be a typeof Number");
        return;
    }
    for (let i = 0; i < num; i += 1) {
        const value = Math.floor(Math.random() * (canvas.clientHeight *0.95));

        const block = document.createElement("div");
        block.classList.add("block");
        block.style.height = `${value}px`;
        block.style.transform = `translateX(${i * 30}px)`;

        const blockLabel = document.createElement("label");
        blockLabel.classList.add("block__id");
        blockLabel.innerHTML = value;

        block.appendChild(blockLabel);
        canvas.appendChild(block);
    }
}

// changes the selected algorithm code
function changeAlgorithm(code) {
    if (sortingAlgo != code) {
        generateBlocks();
        sortingAlgo = code;
        active = false;
        const header = document.querySelector(".algorithm-header");
        switch (code) {
            case algorithms.BUBBLE:
                header.innerText = "Bubble Sort";
                break;

            case algorithms.SELECTION:
                header.innerText = "Selection Sort";
                break;

            case algorithms.INSERTION:
                header.innerText = "Insertion Sort";
                break;

            case algorithms.QUICK:
                header.innerText = "Quick Sort";
                break;

            case algorithms.MERGE:
                header.innerText = "Merge Sort";
                break;

            default:
                break;
        }
    }
    console.log("Code="+sortingAlgo);
}

function changeSpeed(type) {
    switch (type) {
        case speed_modes.SLOW:
            delay = delay_time.SLOW;
            qsDelay = delay_time.QS_SLOW;
            break;
    
        case speed_modes.NORMAL:
            delay = delay_time.NORMAL;
            qsDelay = delay_time.QS_NORMAL;
            break;

        case speed_modes.FAST:
            delay = delay_time.FAST;
            qsDelay = delay_time.QS_FAST;
            break;

        default:
            break;
    }
}

// swap el1 with el2 but only visualy. Does not change the order on the array
function swapVisual(el1, el2) {
    return new Promise(resolve => {
        const style1 = window.getComputedStyle(el1);
        const style2 = window.getComputedStyle(el2);

        const transform1 = style1.getPropertyValue("transform");
        const transform2 = style2.getPropertyValue("transform");

        el1.style.transform = transform2;
        el2.style.transform = transform1;

        // Wait for the transition to end!
        window.requestAnimationFrame(function() {
            setTimeout(() => {
                //canvas.insertBefore(el2, el1);
                resolve();
            }, delay);
        });
    });
}

// swap the element in the position i with the element on the position j and returns the modified array
async function swap(array, i, j) {
    await swapVisual(array[i], array[j]);
    temp = array[i];
    array.splice(i, 1, array[j]);
    array.splice(j, 1, temp);
    return array;
}

function htmlElementToArray(name) {
    let htmlElements = document.querySelectorAll(name);
    let array = new Array();
    for (let i = 0; i < htmlElements.length; i++) {
        array.push(htmlElements[i]);
    }
    return array;
}

// apply bubble sort algorithm to the bars on the screen
async function bubbleSort() {
    if (delay && typeof delay !== "number") {
        alert("sort: First argument must be a typeof Number");
        return;
    }

    blocks = htmlElementToArray(".block");

    for (let i = 0; i < blocks.length - 1; i += 1) {
        for (let j = 0; j < blocks.length - i - 1; j += 1) {

            blocks[j].style.backgroundColor = bar_colours.selectedColour2;
            blocks[j+1].style.backgroundColor = bar_colours.selectedColour;

            const value1 = getValue(blocks[j]);
            const value2 = getValue(blocks[j+1]);

            if (value1 > value2) {
                blocks = await swap(blocks, j, j+1);
            }

            await new Promise(resolve =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );

            blocks[j].style.backgroundColor = bar_colours.initColour;
            blocks[j + 1].style.backgroundColor = bar_colours.initColour;
        }

        blocks[blocks.length - i - 1].style.backgroundColor = bar_colours.doneColour;
    }
    blocks[0].style.backgroundColor = bar_colours.doneColour;
}

// apply selection sort algorithm to the bars on the screen
async function selectionSort() {
    if (delay && typeof delay !== "number") {
        alert("sort: First argument must be a typeof Number");
        return;
    }
    
    blocks = htmlElementToArray(".block");

    for (let i = 0; i < blocks.length-1; i += 1) {
        min = i;
        for (let j = i+1; j < blocks.length; j += 1) {

            blocks[j].style.backgroundColor = bar_colours.selectedColour;
            blocks[min].style.backgroundColor = bar_colours.selectedColour2;

            const value1 = getValue(blocks[j]);
            const value2 = getValue(blocks[min]);

            await new Promise(resolve =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );
            
            if (value1 < value2) {
                blocks[min].style.backgroundColor = bar_colours.initColour;
                min = j;
            } else {
                blocks[j].style.backgroundColor = bar_colours.initColour;
            }

            blocks[j].style.backgroundColor = bar_colours.initColour;
        }

        blocks[i].style.backgroundColor = bar_colours.selectedColour;

        blocks = await swap(blocks, min, i);

        blocks[min].style.backgroundColor = bar_colours.initColour;
        blocks[i].style.backgroundColor = bar_colours.doneColour;
    }
    blocks[blocks.length-1].style.backgroundColor = bar_colours.doneColour;
}

// apply insertion sort algorithm to the bars on the screen
async function insertionSort() {
    if (delay && typeof delay !== "number") {
        alert("sort: First argument must be a typeof Number");
        return;
    }
    
    blocks = htmlElementToArray(".block");

    for (let i = 1; i < blocks.length; i += 1) {
        let valueToInsert = getValue(blocks[i]);
        let j=i-1;
        while (j >= 0 && getValue(blocks[j]) > valueToInsert) {

            blocks[j].style.backgroundColor = bar_colours.selectedColour;
            blocks[j + 1].style.backgroundColor = bar_colours.selectedColour2;

            blocks = await swap(blocks, j, j+1);

            await new Promise(resolve =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );

            blocks[j].style.backgroundColor = bar_colours.initColour;
            blocks[j + 1].style.backgroundColor = bar_colours.initColour;

            j -= 1;
        }
    }

    blocks.forEach((item, index) => {
        blocks[index].style.transition = "background-color 0.7s";
        blocks[index].style.backgroundColor = bar_colours.doneColour;
    })
}

// apply quick sort algorithm to the bars on the screen
async function quickSort() {
    async function partition(array, low, high, pivot) {

        let i = low-1;
        let j = high;
        while (true) {
            while (getValue(array[++i]) < pivot);

            while(j > 0 && getValue(array[--j]) > pivot);

            if (i < array.length) array[i].style.backgroundColor = bar_colours.selectedColour;
            if (j >= 0) array[j].style.backgroundColor = bar_colours.selectedColour;
            await new Promise(resolve => setTimeout(resolve, qsDelay));

            if (i < array.length) array[i].style.backgroundColor = bar_colours.initColour;
            if (j >= 0) array[j].style.backgroundColor = bar_colours.initColour;

            if (i >= j) break;
            
            else await swap(array, i, j);
        }
        array[high].style.backgroundColor = bar_colours.doneColour;
        await swap(array, i, high);
        return i;
    }

    async function quickSortAux(array, low, high) {
        let pi = null;
        if (low < high) {
            let pivot = getValue(array[high]);
            array[high].style.backgroundColor = bar_colours.pivotColour;
            pi = await partition(array, low, high, pivot);
            

            await quickSortAux(array, low, pi-1);
            await quickSortAux(array, pi+1, high);
        }
        else {
            if (high >= 0) array[high].style.backgroundColor = bar_colours.doneColour;
        }
    }

    if (delay && typeof delay !== "number") {
        alert("sort: First argument must be a typeof Number");
        return;
    }
    
    blocks = htmlElementToArray(".block");
    
    await quickSortAux(blocks, 0, blocks.length-1);
}

// apply merge sort algorithm to the bars on the screen
async function mergeSort() {
    async function merge(array, left, middle, right) {
        let start = middle + 1;
        if (getValue(array[middle]) <= getValue(array[start])) return;

        while (left <= middle && start <= right) {
            if (getValue(array[left]) <= getValue(array[start])) left++;
            else {
                let index = start;
                array[index].style.backgroundColor = bar_colours.selectedColour2;
                while (index != left) {
                    array[index-1].style.backgroundColor = bar_colours.selectedColour;
                    await swap(array, index, index-1);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    array[index].style.backgroundColor = bar_colours.initColour;
                    index--;
                }
                array[index].style.backgroundColor = bar_colours.initColour;
                left++;
                middle++;
                start++;
            }
        }
    }

    async function mergeSortAux(array, left, right) {
        if (left < right) {
            // Same as (left + right) / 2, but avoids overflow 
            // for large left and right 
            let middle = Math.floor(left + (right - left) / 2);
            
            await mergeSortAux(array, left, middle);
            await mergeSortAux(array, middle+1, right);
            await merge(array, left, middle, right);
        }
    }

    if (delay && typeof delay !== "number") {
        alert("sort: First argument must be a typeof Number");
        return;
    }
    
    blocks = htmlElementToArray(".block");
    
    await mergeSortAux(blocks, 0, blocks.length-1);

    blocks.forEach((item, index) => {
        blocks[index].style.transition = "background-color 0.7s";
        blocks[index].style.backgroundColor = bar_colours.doneColour;
    })
}

// applies the sorting algorithm that the user selected
function sort() {
    if (!active) {
        active = true;
        switch (sortingAlgo) {
            case algorithms.BUBBLE:
                console.log("Bubble sort");
                bubbleSort();
                break;
        
            case algorithms.SELECTION:
                console.log("Selection sort");
                selectionSort();
                break;

            case algorithms.INSERTION:
                console.log("Insertion sort");
                insertionSort();
                break;

            case algorithms.QUICK:
                console.log("Quicksort");
                quickSort();
                break;         
                
            case algorithms.MERGE:
                console.log("Mergesort");
                mergeSort();
            break;

            default:
                alert("This algorithm not implemented yet.\nPlease try another one.");
                break;
        }
    }
}

// Refresh the canvas and draw a new set of bars
function reset() {
    generateBlocks();
    active = false;
}

generateBlocks();
