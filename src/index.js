// Enum
const algorithms = {
    BUBBLE: 1,
    SELECTION: 2,
    INSERTION: 3,
    QUICK: 4
}
    
const canvas = document.querySelector(".data-container");

let sortingAlgo = algorithms.BUBBLE;
let active = false;
const delay = 70;
const initColour = "#3aafff";
const selectedColour = "#d849ff";
const doneColour = "#13CE66";
const pivotColour = "#ff3a4d";

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
function generateBlocks(num = 30) {
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
                header.innerText = "QuickSort";
                break;

            default:
                break;
        }
    }
    console.log(sortingAlgo);
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
            }, 250);
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

// apply bubble sort algorithm to the bars on the screen
async function bubbleSort() {
    if (delay && typeof delay !== "number") {
        alert("sort: First argument must be a typeof Number");
        return;
    }
    let htmlElements = document.querySelectorAll(".block");
    let blocks = new Array();
    for (let i = 0; i < htmlElements.length; i++) {
        blocks.push(htmlElements[i]);
    }
    for (let i = 0; i < blocks.length - 1; i += 1) {
        for (let j = 0; j < blocks.length - i - 1; j += 1) {
            await new Promise(resolve =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );

            blocks[j].style.backgroundColor = selectedColour;
            console.log(blocks[j].style.backgroundColor);
            blocks[j+1].style.backgroundColor = selectedColour;

            const value1 = getValue(blocks[j]);
            const value2 = getValue(blocks[j+1]);

            if (value1 > value2) {
                blocks = await swap(blocks, j, j+1);
            }

            blocks[j].style.backgroundColor = initColour;
            blocks[j + 1].style.backgroundColor = initColour;
        }

        blocks[blocks.length - i - 1].style.backgroundColor = doneColour;
    }
    blocks[0].style.backgroundColor = doneColour;
}

// apply selection sort algorithm to the bars on the screen
async function selectionSort() {
    if (delay && typeof delay !== "number") {
        alert("sort: First argument must be a typeof Number");
        return;
    }
    let htmlElements = document.querySelectorAll(".block");
    let blocks = new Array();
    for (let i = 0; i < htmlElements.length; i++) {
        blocks.push(htmlElements[i]);
    }

    for (let i = 0; i < blocks.length-1; i += 1) {
        min = i;
        for (let j = i+1; j < blocks.length; j += 1) {
            await new Promise(resolve =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );

            blocks[min].style.backgroundColor = selectedColour;

            const value1 = getValue(blocks[j]);
            const value2 = getValue(blocks[min]);
            
            if (value1 < value2) {
                blocks[min].style.backgroundColor = initColour;
                min = j;
            } else {
                blocks[j].style.backgroundColor = initColour;
            }

            blocks[j].style.backgroundColor = initColour;
        }

        blocks[i].style.backgroundColor = selectedColour;

        blocks = await swap(blocks, min, i);

        blocks[min].style.backgroundColor = initColour;
        blocks[i].style.backgroundColor = doneColour;
    }
    blocks[blocks.length-1].style.backgroundColor = doneColour;
}

// apply insertion sort algorithm to the bars on the screen
async function insertionSort() {
    if (delay && typeof delay !== "number") {
        alert("sort: First argument must be a typeof Number");
        return;
    }
    let htmlElements = document.querySelectorAll(".block");
    let blocks = new Array();
    for (let i = 0; i < htmlElements.length; i++) {
        blocks.push(htmlElements[i]);
    }
    for (let i = 1; i < blocks.length; i += 1) {
        let valueToInsert = getValue(blocks[i]);
        let j=i-1;
        while (j >= 0 && getValue(blocks[j]) > valueToInsert) {
            await new Promise(resolve =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );

            blocks[j].style.backgroundColor = selectedColour;
            blocks[j + 1].style.backgroundColor = selectedColour;

            blocks = await swap(blocks, j, j+1);


            blocks[j].style.backgroundColor = initColour;
            blocks[j + 1].style.backgroundColor = initColour;

            j -= 1;
        }
    }

    blocks.forEach((item, index) => {
        blocks[index].style.transition = "background-color 0.7s";
        blocks[index].style.backgroundColor = doneColour;
    })
}

// apply quick sort algorithm to the bars on the screen
async function quickSort() {
    async function partition(array, low, high, pivot) {
        console.log ("pivot = "+ pivot);

        let i = low-1;
        let j = high;
        while (true) {
            while (getValue(array[++i]) < pivot);

            while(j > 0 && getValue(array[--j]) > pivot);

            if (i < array.length) array[i].style.backgroundColor = selectedColour;
            if (j >= 0) array[j].style.backgroundColor = selectedColour;
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (i < array.length) array[i].style.backgroundColor = initColour;
            if (j >= 0) array[j].style.backgroundColor = initColour;

            if (i >= j) break;
            
            else await swap(array, i, j);
        }
        array[high].style.backgroundColor = doneColour;
        await swap(array, i, high);
        return i;
    }

    async function quickSortAux(array, low, high) {
        let pi = null;
        if (low < high) {
            let pivot = getValue(array[high]);
            array[high].style.backgroundColor = pivotColour;
            pi = await partition(array, low, high, pivot);
            console.log("pi = "+pi);

            await quickSortAux(array, low, pi-1);
            await quickSortAux(array, pi+1, high);
        }
        else {
            if (high >=0) array[high].style.backgroundColor = doneColour;
        }
    }

    if (delay && typeof delay !== "number") {
        alert("sort: First argument must be a typeof Number");
        return;
    }
    let htmlElements = document.querySelectorAll(".block");
    let blocks = new Array();
    for (let i = 0; i < htmlElements.length; i++) {
        blocks.push(htmlElements[i]);
    }
    
    await quickSortAux(blocks, 0, blocks.length-1);

    console.log('\n');
    for (let k=0; k < blocks.length; k++) {
        console.log(getValue(blocks[k]));
    }
    console.log('\n');
}

// applies the sorting algorithm that the user selected
function sort() {
    if (!active) {
        active = true;
        switch (sortingAlgo) {
            case algorithms.BUBBLE:
                bubbleSort();
                console.log("Bubble sort");
                break;
        
            case algorithms.SELECTION:
                selectionSort();
                console.log("Selection sort");
                break;

            case algorithms.INSERTION:
                insertionSort();
                console.log("Insertion sort");
                break;

            case algorithms.QUICK:
                quickSort();
                console.log("Quicksort");
                break;            
            default:
                alert("Algorithms not implemented");
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
