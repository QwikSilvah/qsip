// JavaScript source code

const d = document;

let ips; //setting up localStorage
if (window.localStorage._ip) {
    ips = JSON.parse(window.localStorage._ip);
}
else {
    ips = [];
}

console.log(ips);
//let items = [];
let currentStorageIndex = 0;
let timeOnClick;
//if (ips.length) {
//    timeOnClick = ips[currentStorageIndex].time
//}

const v = {
    list: d.querySelector(".list"),
    input: d.querySelector(".input"),
    addButton: d.querySelector(".add"),
    selections: d.querySelector(".number"),
    total: d.querySelector(".total"),
    extractButton: d.querySelector(".extract"),

    historyNav: d.querySelector(".history-nav"),
    previous: d.querySelector(".previous"),
    time: d.querySelector(".time"),
    next: d.querySelector(".next"),

    timeDisplay: d.querySelector(".time-on-hover"),

    results: d.querySelector(".results"),

    historyModify: d.querySelector(".history-modify"),
    historyEdit: d.querySelector(".edit-item"),
    historyRemove: d.querySelector(".remove-history-item"),
    historyClear: d.querySelector(".clear-history"),

    showItem(...items) {
        //this.list.append(item);
        for (item of items) {
            if (item) {
                item.style.display = "block";
            }
        }
        
    },
    hideItem(...items) {
        for (item of items) {
            if (item) {
                item.style.display = "none";
            }
        }
    },

    toggleItem(item) {
        if (item.style.display == "none") {
            item.style.display = "block";
        }
        else {
            item.style.display = "none";
        }
    }
}


v.addButton.addEventListener("click", addItem);
d.body.addEventListener("keyup", checkKey);
d.body.addEventListener("click", removeItem);
v.extractButton.addEventListener("click", extract);
//v.time.addEventListener("mouseover", showTime);
v.time.addEventListener("click", toggleTimeDisplay);
v.previous.addEventListener("click", showPrevious);
v.next.addEventListener("click", showNext);
v.historyEdit.addEventListener("click", editHistory);
v.historyRemove.addEventListener("click", removeHistoryItem);
v.historyClear.addEventListener("click", clearHistory);



//if (ips.length) {
//    v.time.innerHTML = `<span title="${ips[index].time.toDateString}">${ext.howLongAgo(ips[index].time)}<span>`;
//    const [selection, rejection] = [ips[index].selection, ips[index].rejection];
//    console.log("create html");
//    for (let item of selection) {
//        v.results.innerHTML += `<p class="selected">${item}</p>`
//    }
//    for (let item of rejection) {
//        v.results.innerHTML += `<p class="rejected">${item}</p>`
//    }
//    console.log("created");
//}

function addItem(event) {
    if (v.input.value === "") return;

    const newItem = d.createElement("li");
    newItem.innerHTML = `<span class="col-10">${v.input.value}</span> <button class="close-btn col-1" onclick="function removeItem () {event.target.parent.innerHTML = '';}"><i class="fa-solid fa-xmark"></i></button>`;
    v.list.append(newItem);     
    
    v.input.value = "";

    onAdd();
    onChange();
}

function removeItem(event) {
    event.preventDefault();    
    const itemlist = getList();
    for (let item of itemlist) {
        if (item.querySelector(".close-btn").contains(event.target)) {
            item.remove();
        }
    }

    onRemove();
    onChange();
}

function checkKey(event) {
    event.preventDefault();
    if (event.key !== "Enter") return;
    if (!event.shiftKey) {
        addItem();
        return;
    }
    extract();
}

function renderHTML(index=0) {
    v.list.innerHTML = "";
    v.results.innerHTML = "";

    showHistoryArea();

    const resObj = ips[index];
    const { selected, rejected, time, input } = resObj;
    //const selection = resObj.selection;
    //const rejection = resObj.rejection;
    //const time = resObj.time;
    console.log("create html");
        
    v.time.innerHTML = ext.howLongAgo(time);
        
    for (let item of selected) {
        v.results.innerHTML += `<p class="selected">${item}</p>`
    }
    for (let item of rejected) {
        v.results.innerHTML += `<p class="rejected">${item}</p>`
    }
    console.log("created");

    if (ips.length > 1) {
        v.previous.removeAttribute("disabled");
    }

    timeOnClick = `${new Date(time).toDateString()} at ${ext.getTime(time)}`;
    v.timeDisplay.innerHTML = timeOnClick;
}

function extract() {
    currentStorageIndex = 0
    if (v.selections.value >= Number(v.total.innerText)) {
        warningMsg();
        return;
    }
    if (v.selections.value < 2) {
        warningMsg();
        return;
    }
    if (!confirm(`Do you wish to proceed?`)) return;
    const selected = [];
    const rejected = [];
    const input = getValues();
    const items = input.slice();
    for (let i = 1; i <= v.selections.value; i++) {
        ext.shuffleArray(items);
        selected.push(items.shift());
        console.log(items.length);
    }
    const residueNum = items.length;
    for (let i = 0; i < residueNum; i++) {
        ext.shuffleArray(items);
        rejected.push(items.shift());

        console.log(items.length);
    }
    const resObj = {
        selected: selected,
        rejected: rejected,
        time: Date.parse(new Date()),
        input: input
    }
    console.log(resObj);
    console.log(ips);
    ips.unshift(resObj);
    if (ips.length > 10) {
        ips.length = 10;
    }
    console.log(ips);

    updateHistory();
    
    renderHTML();
}



function getList() {
    return d.querySelectorAll("li");
}

function onAdd() {
    if (getList().length > 2) {
        v.selections.removeAttribute("disabled");
        v.extractButton.removeAttribute("disabled");
    }    
}

function onRemove() {
    if (getList().length <= 2) {
        v.selections.setAttribute("disabled", "true");
        v.extractButton.setAttribute("disabled", "true");
    }
    v.total.innerHTML = getList().length;
}

function onChange() {
    const listLength = getList().length
    const attribValue = listLength - 1;
    v.selections.setAttribute("max", attribValue);
    //if (getList().length > 2) {
    //    v.selections.value = getList().length - 1;
    //}
    v.total.innerHTML = listLength;
}

function getValues() {
    const values = []
    const list = getList();
    for (let item of list) {
        values.push(item.querySelector("span").innerText);
    }
    return values;
}

function warningMsg() {
    alert(`Unable to handle your request. Please make sure you entered everything correctly`);
}

function toggleTimeDisplay() {
    v.toggleItem(v.timeDisplay);
}

function showPrevious() {
    renderHTML(++currentStorageIndex);

    const max = ips.length - 1;
    if (currentStorageIndex >= max) {
        v.previous.setAttribute("disabled", "true");
    }

    v.next.removeAttribute("disabled");
}

function showNext() {
    renderHTML(--currentStorageIndex);
    if (currentStorageIndex < 1) {
        v.next.setAttribute("disabled", "true");
    }
}

function editHistory() {
    const input = ips[currentStorageIndex].input;
    for (element of input) {
        v.list.innerHTML += `<li><span class="col-10">${element}</span> <button class="close-btn col-1" onclick="function removeItem () {event.target.parent.innerHTML = '';}"><i class="fa-solid fa-xmark"></i></button></li>`
    }
    v.extractButton.removeAttribute("disabled");
}

function removeHistoryItem() {
    ips.splice(currentStorageIndex, 1);
    if (ips[currentStorageIndex]) {
        renderHTML(currentStorageIndex);
    }
    if (!ips[currentStorageIndex + 1]) {
        v.previous.setAttribute("disabled", true);
    }
    if (ips.length === 1) {
        clearHistory();
    }
    updateHistory();
}

function clearHistory() {
    ips.length = [];
    updateHistory();
    hideHistoryArea();
}

function updateHistory() {
    window.localStorage._ip = JSON.stringify(ips);    
}

function checkHistory() {
    if (!ips.length) {
        v.hideItem()
    }
}

function hideHistoryArea() {
    v.hideItem(v.historyNav, v.timeDisplay, v.results, v.historyModify);
}

function showHistoryArea() {
    v.showItem(v.historyNav, v.timeDisplay, v.results, v.historyModify);
}

hideHistoryArea();
if (ips.length) {
    showHistoryArea();
    renderHTML();
}//initialize history if any

