const container = document.querySelector(".data-container");

function generateBlocks(num = 30) {
    num = container.clientWidth / 30 - 1;
    if (num && typeof num !== "number") {
        alert("First argument must be a typeof Number");
        return;
    }
    for (let i = 0; i < num; i += 1) {
        const value = Math.floor(Math.random() * (container.clientHeight *0.95));

        const block = document.createElement("div");
        block.classList.add("block");
        block.style.height = `${value}px`;
        block.style.transform = `translateX(${i * 30}px)`;

        const blockLabel = document.createElement("label");
        blockLabel.classList.add("block__id");
        blockLabel.innerHTML = value;

        block.appendChild(blockLabel);
        container.appendChild(block);
    }
}

function swap(el1, el2) {
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
                container.insertBefore(el2, el1);
                resolve();
            }, 250);
        });
    });
}

async function bubbleSort(delay = 70) {
    if (delay && typeof delay !== "number") {
        alert("sort: First argument must be a typeof Number");
        return;
    }
    let blocks = document.querySelectorAll(".block");
    for (let i = 0; i < blocks.length - 1; i += 1) {
        for (let j = 0; j < blocks.length - i - 1; j += 1) {
            await new Promise(resolve =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );

            blocks[j].style.backgroundColor = "#d849ff";
            blocks[j + 1].style.backgroundColor = "#D849FF";

            const value1 = Number(blocks[j].childNodes[0].innerHTML);
            const value2 = Number(blocks[j + 1].childNodes[0].innerHTML);

            if (value1 > value2) {
                await swap(blocks[j], blocks[j + 1]);
                blocks = document.querySelectorAll(".block");
            }

            blocks[j].style.backgroundColor = "#3aafff";
            blocks[j + 1].style.backgroundColor = "#3aafff";
        }

        blocks[blocks.length - i - 1].style.backgroundColor = "#13CE66";
    }
}

generateBlocks();
bubbleSort();
