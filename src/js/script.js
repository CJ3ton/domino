const board = document.querySelector('.game__board'),
    dominos = board.querySelector('.game__board-dominos'),
    firework = document.querySelector('.firework'),
    startBtn = document.querySelector('.btn-start'),
    redoBtn = document.querySelector('.btn-redo');

let ani = '';
const domino = [];
const dominoSet = [];
let redo = [];
let opened = [];
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

redoBtn.addEventListener('click', () => {
    redoMove();
});

// Класс кость домино

class DominoItem {
    constructor(id, firstNum, secondNum) {
        this.id = id; // Идентификатор
        this.firstNum = firstNum; // Количество точек на 1 половине
        this.secondNum = secondNum; // количество точек на 2 половине
        this.status = 0; // Открыта (точками ввверх) или закрыта (точками вниз)
        this.set = true; // Находится на поле или нет
        this.canOpen = false; // Можно ли открыть
        this.rotated = false; // Поворот кости на 180 градусов, если true
        this.active = false; // Активность
        this.value = this.firstNum + this.secondNum; // Сумма точек на обеих половинках
    }

    open() {
        this.status = 1;
    }
    
    close() {
        this.status = 0;
    }
}

//Функция создания массива костей (28 штук)

function createDominoItems() {
    let count = 0;
    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {
            dominoSet[count] = new DominoItem(count, i, j);
            count++;
        }
    }
}

// Функция перемешивания костей

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

// Функция открывает (переворачивает точками вверх) кость

function dominoItemOpen(id) {
    if (dominoSet[id].status === 0) {
        dominoSet[id].open();
        domino[id].classList.remove('down');
        domino[id].classList.add(`open-${dominoSet[id].id}`);
        opened.push(id);
    }
}

// Функция закрывает кость (переворачивает точками вниз)

function dominoItemClose(id) {
    dominoSet[id].close();
    domino[id].classList.add('down');
    domino[id].classList.remove(`open-${dominoSet[id].id}`);
}

// Инициализация игры

function gameInit() {
    dominos.innerHTML = '';
    firework.innerHTML = '';
    fireworkHide();
    if (ani !== '') {
        clearInterval(ani);
    }
    for (let i = 0; i < 28; i++) {
        domino[i] = document.createElement('div');
        domino[i].classList.add('domino', 'down');
        domino[i].setAttribute('data-id', `${i}`);
        dominos.append(domino[i]);
    }
    createDominoItems(); // Создаем кости
    shuffle(dominoSet); // Перемешиваем кости
    let count = 0;
    activeItem = -1;
    for (let i = 1; i < 8; i++) {
        for (let j = 1; j <= i; j++) {
            dominoSet[count].pos = (i * 10 + j);
            count++;
        }
    }
    openItems.forEach((item, i) => { // Открываем кости, которые изначально открыты
        dominoItemOpen(item);
        opened = [];
    });
}

// Функция действий с костями (активация при клике на кость, деактивация при повторном клике)

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
                    redo = [];
                    redo.push(activeItem, id);
                    console.log(`Redo: ${redo}`);
                    activeItem = -1;
                    let win = checkWin();
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

// Функция убирает с поля пару костей

function removePair(id1, id2) {
    opened = [];
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
    console.log(`Opened: ${opened}`);
}

// Функция отмены хода

function redoMove() {
    if (redo.length === 0) {
        return;
    }
    for (let i = 1; i < 3; i++) {
        let id = redo.pop();
        dominoSet[id].set = true;
        domino[id].classList.remove('hide');

        if (dominoSet[id].active) {
            dominoSet[id].active = false;
            activeItem = -1;
            domino[id].classList.remove('active');
        }
    }
    opened.forEach(item => {
        dominoItemClose(item);
    });
    opened = [];
    redo = [];
}

// Функция проверяет, можно ли открыть кость

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

// Функция проверяет сумму точек пары костей, если равна 12, то возвращает TRUE

function checkSum(id1, id2) {
    if (dominoSet[id1].value + dominoSet[id2].value === 12) {
        return true;
    } else {
        return false;
    }
}

// Проверка на выигрыш, если все кости убраны с поля, то победа!

function checkWin() {
    let set = dominoSet.filter((item) => {
        return item.set === true;
    });
    if (set.length === 0) {
        return true;
    } else {
        return false;
    }
}

// Победный фейерверк из костей (заполняет экран костями в случайном порядке)

function gameWin() {
    fireWorkShow();
    let sX = firework.offsetWidth;
    let sY = firework.offsetHeight;
    ani = setInterval(() => {
        fireWorkElement(sX, sY);
    }, 1);
    setTimeout(() => {
        clearInterval(ani);
    }, 10000);
}

// Функция создает случайную кость и помещает в случайном месте на экране

function fireWorkElement(maxX, maxY) {
    let x = Math.floor(Math.random() * maxX + 1);
    let y = Math.floor(Math.random() * maxY + 1);
    let type = Math.floor(Math.random() * 28);
    const plate = document.createElement('div');
    plate.classList.add('domino', `open-${type}`);
    plate.setAttribute('data-id', '');
    plate.style.cssText = `position: absolute; top: ${y}px; left: ${x}px; z-index: 2;`;
    firework.append(plate);
}

// Показывем фейерверк

function fireWorkShow() {
    firework.classList.remove('hide');
    firework.classList.add('show');
}

// Скрываем фейерверк

function fireworkHide() {
    firework.classList.add('hide');
    firework.classList.remove('show');
}

// Инициализация игры после загрузки страницы

window.addEventListener('DOMContentLoaded', gameInit);