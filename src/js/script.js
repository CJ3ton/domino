const board = document.querySelector('.game__board'),
    dominos = board.querySelector('.game__board-dominos'),
    firework = document.querySelector('.firework'),
    startBtn = document.querySelector('.btn-start');

let ani='';
const domino = [];
const dominoSet = [];
let activeItem = -1;
const openItems = [0, 21, 22, 23, 24, 25, 26, 27];
const map = [11,
    21, 22,
    31, 32, 33,
    41, 42, 43, 44,
    51, 52, 53, 54, 55,
    61, 62, 63, 64, 65, 66,
    71, 72, 73, 74, 75, 76, 77
];

dominos.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    dominoItemActivity(id);
});

startBtn.addEventListener('click', () => {
    gameInit();
});

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

function dominoItemOpen(id) {
    dominoSet[id].open();
    domino[id].classList.remove('down');
    domino[id].classList.add(`open-${dominoSet[id].id}`);
}

function gameInit() {
    dominos.innerHTML = '';
    firework.innerHTML = '';
    fireworkHide();
    if(ani !== '') {
        clearInterval(ani);
    }
    for (let i = 0; i < 28; i++) {
        domino[i] = document.createElement('div');
        domino[i].classList.add('domino', 'down');
        domino[i].setAttribute('data-id', `${i}`);
        dominos.append(domino[i]);
    }
    createDominoItems();
    shuffle(dominoSet);
    let count = 0;
    activeItem = -1;
    for (let i = 1; i < 8; i++) {
        for (let j = 1; j <= i; j++) {
            dominoSet[count].pos = (i * 10 + j);
            count++;
        }
    }
    openItems.forEach((item, i) => {
        dominoItemOpen(item);
    });
}

function dominoItemActivity(id) {
    let currentItem = dominoSet[id];
    if (currentItem.status !== 0) {
        if (!currentItem.active) {
            if (activeItem == -1) {
                domino[id].classList.add('active');
                currentItem.active = true;
                activeItem = id;
            } else {
                if (checkSum(activeItem, id)) {
                    removePair(activeItem, id);
                    activeItem = -1;
                    let win = checkWin();
                    console.log(win);
                    if (win) {
                        gameWin();
                    }
                } else {

                }

            }
        } else {
            currentItem.active = false;
            activeItem = -1;
            domino[id].classList.remove('active');
        }
    }
}

function removePair(id1, id2) {
    dominoSet[id1].set = false;
    dominoSet[id2].set = false;
    domino.forEach((item, i) => {
        if (dominoSet[i].set == false) {
            domino[i].classList.add('hide');
        }
        if (canOpen(i)) {
            dominoItemOpen(i);
        }
    });
}

function canOpen(id) {
    const pos = dominoSet[id].pos;
    const t1 = (dominoSet[map.indexOf(pos - 11)]) ? dominoSet[map.indexOf(pos - 11)].set : false;
    const t2 = (dominoSet[map.indexOf(pos - 10)]) ? dominoSet[map.indexOf(pos - 10)].set : false;
    const d1 = (dominoSet[map.indexOf(pos + 10)]) ? dominoSet[map.indexOf(pos + 10)].set : false;
    const d2 = (dominoSet[map.indexOf(pos + 11)]) ? dominoSet[map.indexOf(pos + 11)].set : false;
    if ((t1 == false && t2 == false) || (d1 == false && d2 == false)) {
        return true;
    } else {
        return false;
    }
}

function checkSum(id1, id2) {
    if (dominoSet[id1].value + dominoSet[id2].value === 12) {
        return true;
    } else {
        return false;
    }
}

function checkWin() {
    let set = dominoSet.filter((item) => {
        return item.set === true;
    });
    if (set.length === 0) {
        return true;
    } else return false;
}

function gameWin() {
    fireWorkShow();
    let sX = firework.offsetWidth;
    let sY = firework.offsetHeight;
    ani = setInterval(() => {
        fireWorkElement(sX, sY);
    }, 1);
}

function fireWorkElement(maxX, maxY) {
    let x = Math.floor(Math.random() * maxX + 1);
    let y = Math.floor(Math.random() * maxY + 1);
    let type = Math.floor(Math.random() * 28);
    console.log(x, y, type);
    const plate = document.createElement('div');
    plate.classList.add('domino', `open-${type}`);
    plate.setAttribute('data-id', '');
    plate.style.cssText = `position: absolute; top: ${y}px; left: ${x}px; z-index: 2;`;
    firework.append(plate);
}

function fireWorkShow() {
    firework.classList.remove('hide');
    firework.classList.add('show');
}

function fireworkHide() {
    firework.classList.add('hide');
    firework.classList.remove('show');
}

window.addEventListener('DOMContentLoaded', gameInit);