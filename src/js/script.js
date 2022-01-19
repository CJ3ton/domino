const board = document.querySelector('.game__board'),
    dominos = board.querySelector('.game__board-dominos'),
    domino = dominos.querySelectorAll('.domino');

const defaultArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
const boardSet = shuffle(defaultArr);
const dominoSet = [];

function dominoItem(id, firstNum, secondNum, status, set) {
    this.id = id;
    this.firstNum = firstNum;
    this.secondNum = secondNum;
    this.status = 'down';
    this.set = true;
    this.open = function () {
        this.status = 'up';
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

function dominoItemOpen(id) {
    dominoSet[boardSet[id]].open();
}

function gameInit() {
    createDominoItems();
    //dominoItemUp(4);
    console.log(dominoSet[4]);
}

dominos.addEventListener('click', (e) => {
    const id = e.target.dataset.id - 1;
    currentItem = dominoSet[boardSet[id]];
    dominoItemOpen(id);
});

window.addEventListener('DOMContentLoaded', gameInit);