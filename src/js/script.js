const board = document.querySelector('.game__board'),
    dominos = board.querySelector('.game__board-dominos'),
    domino = dominos.querySelectorAll('.domino');

const dominoSet = [];
let activeItem = 0;
const openItems = [0, 21, 22, 23, 24, 25, 26, 27];

function dominoItem(id, firstNum, secondNum, status, set) {
    this.id = id;
    this.firstNum = firstNum;
    this.secondNum = secondNum;
    this.status = 0;
    this.set = true;
    this.canOpen = false;
    this.rotated = false;
    this.active = false;
    this.value = this.firstNum + this.secondNum;
    this.open = function () {
        this.status = 1;
    };
}

function createDominoItems() {
    let count = 0;
    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {
            dominoSet[count] = new dominoItem(count, i, j);
            count++;
        }
    }
}

function shuffle(arr) {
    let j, temp;
    for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function boardRender() {
    dominoSet.forEach((item, i) => {

    });
}

function dominoItemOpen(id) {
    dominoSet[id].open();
    domino[id].classList.add(`open-${dominoSet[id].id}`);
}

function gameInit() {
    createDominoItems();
    shuffle(dominoSet);
    openItems.forEach((item, i) => {
        dominoItemOpen(item);
    });
    //boardRender();
    console.log(dominoSet);
}

function dominoItemActivity(id) {
    currentItem = dominoSet[id];
    if (currentItem.status !== 0) {
        if (!currentItem.active) {
            if (activeItem == 0) {
                domino[id].classList.add('active');
                currentItem.active = true;
                activeItem = id;
            } else {
                if (checkSum(activeItem, id)) {
                    console.log('YES!');
                }

            }
        } else {
            currentItem.active = false;
            activeItem = 0;
            domino[id].classList.remove('active');
        }

    }
    console.log(currentItem);
}

function checkSum(id1, id2) {
    if (dominoSet[id1].value + dominoSet[id2].value === 12) {
        return true;
    } else {
        return false;
    }
}

dominos.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    dominoItemActivity(id);
});

window.addEventListener('DOMContentLoaded', gameInit);