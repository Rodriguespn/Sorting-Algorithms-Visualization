// Enum
const algorithms = {
    BUBBLE: 1,
    SELECTION: 2,
    INSERTION: 3
}
    
const canvas = document.querySelector(".data-container");

let sortingAlgo = algorithms.BUBBLE;
let active = false;
const delay = 70;
const initColour = "#3aafff";
const selectedColour = "#d849ff";
const doneColour = "#13CE66";

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

            blocks[j].style.backgroundColour = selectedColour;
            blocks[j+1].style.backgroundColour = selectedColour;

            const value1 = Number(blocks[j].childNodes[0].innerHTML);
            const value2 = Number(blocks[j + 1].childNodes[0].innerHTML);

            if (value1 > value2) {
                blocks = await swap(blocks, j, j+1);
            }

            blocks[j].style.backgroundColour = initColour;
            blocks[j + 1].style.backgroundColour = initColour;
        }

        blocks[blocks.length - i - 1].style.backgroundColour = doneColour;
    }
    blocks[0].style.backgroundColour = doneColour;
}

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

            blocks[j].style.backgroundColour = selectedColour;
            blocks[min].style.backgroundColour = selectedColour;

            const value1 = Number(blocks[j].childNodes[0].innerHTML);
            const value2 = Number(blocks[min].childNodes[0].innerHTML);
            
            if (value1 < value2) {
                blocks[min].style.backgroundColour = initColour;
                min = j;
            } else {
                blocks[j].style.backgroundColour = initColour;
            }

            //blocks[j + 1].style.backgroundColour = doneColour;
        }

        blocks = await swap(blocks, min, i);

        blocks[i].style.backgroundColour = doneColour;
            
        //blocks[blocks.length - i - 1].style.backgroundColour = initCoulour;
    }
    //blocks[0].style.backgroundColour = doneColour;
}

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
        /*console.log('\n');
        for (let k=0; k < blocks.length; k++) {
            console.log(Number(blocks[k].childNodes[0].innerHTML));
        }
        console.log('\n');*/
        let valueToInsert = Number(blocks[i].childNodes[0].innerHTML);
        let j=i-1;
        while (j >= 0 && Number(blocks[j].childNodes[0].innerHTML) > valueToInsert) {
            await new Promise(resolve =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );

            /*blocks[j].style.backgroundColour = selectedColour;
            blocks[j + 1].style.backgroundColour = selectedColour;*/

            blocks = await swap(blocks, j, j+1);

            blocks[j].style.backgroundColour = doneColour;
            blocks[j + 1].style.backgroundColour = doneColour;

            j -= 1;
        }

        console.log(j+1);

        //blocks[blocks.length - i - 1].style.backgroundColour = initColour;
    }
    blocks[0].style.backgroundColour = doneColour;
}

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
            
            default:
                alert("Algorithms not implemented");
                break;
        }
    }
}

function reset() {
    generateBlocks();
    active = false;
}

generateBlocks();
