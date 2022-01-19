const board = document.querySelector('.game__board'),
    dominos = board.querySelector('.game__board-dominos'),
    domino = dominos.querySelectorAll('.domino');

const defaultArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];

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

const domino1 = new dominoItem(1, 0, 1);

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

function gameInit() {
    const boardSet = shuffle(defaultArr);
    console.log(domino1);
    domino1.open();
    console.log(domino1);
}

window.addEventListener('DOMContentLoaded', gameInit);