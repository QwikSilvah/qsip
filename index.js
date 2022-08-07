// JavaScript source code

//ensure dialogue.js

const d = document;

let ips; //setting up localStorage
if (window.localStorage._ip) {
    ips = JSON.parse(window.localStorage._ip);
}
else {
    ips = [];
}

console.log(ips);

let currentStorageIndex = 0;
let timeOnClick;

let timeDisplay = 0;
let editInput;
let currentInputValue;

const v = {
    list: d.querySelector(".list"),
    inputForm: d.querySelector("#item-input-form"),
    input: d.querySelector(".input"),
    addButton: d.querySelector(".add"),
    selections: d.querySelector(".number"),
    total: d.querySelector(".total"),
    reset: d.querySelector(".qs-reset"),
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
v.inputForm.addEventListener("submit", addItem);
d.body.addEventListener("keyup", checkKey);

v.reset.addEventListener("click", () => dialogue.showModal({
    type: "confirm",
    accept: "Yes",
    reject: "No",
    header: "Clear List?",
    content: "Do you wish to remove all items?",
    styles: {
        header: {
            background: "info",
            text: "black"
        },
        footer: "light",
    },
    callback: () => {
        if (document.querySelector(".corroborate")) {
            document.querySelector(".corroborate").addEventListener("click", (event) => {
                resetInputArea();
            });
        }
    }
}));

v.extractButton.addEventListener("click", validate);

v.time.addEventListener("click", toggleTimeDisplay);
v.previous.addEventListener("click", showPrevious);
v.next.addEventListener("click", showNext);

v.historyEdit.addEventListener("click", editHistory);
v.historyRemove.addEventListener("click", () => dialogue.showModal({
    type: "confirm",
    accept: "Yes",
    reject: "No",
    header: "Remove From History?",
    content: "This action cannot be reversed",
    styles: {
        header: {
            background: "warning",
            text: "black"
        },
        footer: "light"
    },
    callback: () => {
        if (document.querySelector(".corroborate")) {
            document.querySelector(".corroborate").addEventListener("click", (event) => {
                removeHistoryItem();
            });
        }
    }
}));
v.historyClear.addEventListener("click", () => dialogue.showModal({
    type: "confirm",
    accept: "Yes",
    reject: "No",
    header: "Clear Entire History?",
    content: "This action cannot be reversed",
    styles: {
        header: {
            background: "danger",
            text: "white"
        },
        footer: "light"
    },
    callback: () => {
        if (document.querySelector(".corroborate")) {
            document.querySelector(".corroborate").addEventListener("click", (event) => {
                clearHistory();
            });
        }
    }
}));

d.body.addEventListener("click", saveEdit);


function addItem(event) {
    if (v.input.value === "") return;

    const newItem = d.createElement("li");
    newItem.innerHTML = `<span class="row"><span class="col-11">${v.input.value}</span> <button class="close-btn col-1"><i class="fa-solid fa-xmark"></i></button></span>`;
    v.list.append(newItem);     
    
    v.input.value = "";

    onAdd();
    onChange();
}

function removeItem(event) {
    event.preventDefault();    
    const itemlist = getList();
    for (let item of itemlist) {
        if (!item.querySelector(".close-btn")) return;
        if (item.contains(event.target)) {
            item.remove();
            onRemove();
            onChange();
        }
    }        
}

function checkKey(event) {
    event.preventDefault();
    if (event.key !== "Enter") return;
    if (!event.shiftKey) {
        //addItem();
        return;
    }
    validate();
}

function renderHTML(index=0) {
    v.list.innerHTML = "";
    v.results.innerHTML = "";

    showHistoryArea();

    const resObj = ips[index];
    const { selected, rejected, time, input } = resObj;
    console.log("create html");

    v.time.innerHTML = `${ext.howLongAgo(time)}<br class="age-ordinal-break" />(${(ips.length - currentStorageIndex)}/${ips.length})`;
        
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
    v.hideItem(v.timeDisplay);

    onChange();
}

function validate() {
    if (v.selections.value >= Number(v.total.innerText)) {
        return warningMsg();;
    }
    if (v.selections.value < 2) {
        return warningMsg();
    }
    dialogue.showModal({
        type: "confirm",
        accept: "Yes",
        reject: "No",
        header: "Select Items?",
        content: "Do you wish to proceed?",
        styles: {
            header: {
                background: "primary",
                text: "white"
            },
            footer: "light"
        },
        callback: () => {
            if (document.querySelector(".corroborate")) {
                document.querySelector(".corroborate").addEventListener("click", (event) => {
                    extract();
                });
            }
        }
    });
}

function extract() {
    //if (!confirm("Do you wish to proceed?")) return;

    currentStorageIndex = 0;
    
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
    if (ips.length > 30) {
        ips.length = 30;
    }
    console.log(ips);

    updateHistory();
    
    renderHTML();
}



function getList() {
    return d.querySelectorAll("li");
}

function onAdd() {
    if (getList().length < 2) {
        showEditAlert();
    }
    if (getList().length > 2) {
        v.selections.removeAttribute("disabled");
        v.extractButton.removeAttribute("disabled");
    }

    v.input.focus();
}

function onRemove() {
    if (getList().length <= 2) {
        v.selections.setAttribute("disabled", "true");
        v.extractButton.setAttribute("disabled", "true");
    }
    v.total.innerHTML = getList().length;

    v.input.focus();

}

function onChange() {
    const list = getList();
    const listLength = list.length
    const attribValue = listLength - 1;
    v.selections.setAttribute("max", attribValue);
    
    v.total.innerHTML = listLength;

    if (list.length) {
        for (element of list) {
            element.firstChild.addEventListener("dblclick", raiseEdit);
        }
        v.reset.removeAttribute("disabled");
    }
    else {
        v.reset.setAttribute("disabled", "true");
    }

    for (element of d.querySelectorAll(".close-btn")) {
        element.addEventListener("click", removeItem, false);
    }

    console.log("onChange called");
}

function resetInputArea() {
    //if (!confirm("Clear items?")) return;

    let amount = 0;
    let increment = 90;

    removeOne();
    timer = window.setInterval(removeOne, 20);
    function removeOne() {
        if (getList().length) {
            getList()[0].remove();
            v.reset.style.transform = `rotate(${amount}deg)`;
            amount += increment;
            onChange();
        }
        else {
            window.clearInterval(timer);
            v.reset.style.transform = "rotate(0deg)";
        }
    }      
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
    dialogue.showModal({
        header: `Unable to handle your request`,
        content: `Please make sure you entered everything correctly`,
        reject: "Ok",
        styles: {
            header: {
                background: "warning",
                text: "black"
            },
            footer: "light"
        }
    });

}

function toggleTimeDisplay() {
    v.toggleItem(v.timeDisplay);
    if (!timeDisplay) timeDisplay = 1;
    else timeDisplay = 0;
}

function showPrevious() {
    renderHTML(++currentStorageIndex);

    const max = ips.length - 1;
    if (currentStorageIndex >= max) {
        v.previous.setAttribute("disabled", "true");
    }

    v.next.removeAttribute("disabled");
    if (timeDisplay) {
        v.showItem(v.timeDisplay);
    }
}

function showNext() {
    renderHTML(--currentStorageIndex);
    if (currentStorageIndex < 1) {
        v.next.setAttribute("disabled", "true");
    }
    if (timeDisplay) {
        v.showItem(v.timeDisplay);
    }
}

function editHistory() {
    const input = ips[currentStorageIndex].input;
    v.list.innerHTML = "";
    for (element of input) {
        v.list.innerHTML += `<li class=""><span class="row"><span class="col-11">${element}</span> <button class="close-btn col-1"><i class="fa-solid fa-xmark"></i></button></span></li>`
    }
    v.extractButton.removeAttribute("disabled");

    function scrollToTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

    showEditAlert();

    window.setTimeout(scrollToTop, 500);
    //v.input.focus();
    v.reset.removeAttribute("disabled");

    onChange();
}

function showEditAlert() {
    const alertBox = d.createElement("div");
    alertBox.style.paddingTop = ".4rem";
    alertBox.style.paddingBottom = ".4rem";
    d.querySelector(".input-container").prepend(alertBox);
    dialogue.showAlert(
        {
            target: alertBox,
            alertClass: "primary",
            content: "Double click item to edit",
            close: true,
            width: "100%",
            duration: 3000
        }
    );
}

function removeHistoryItem() {
    //if (!confirm("Remove item? This action cannot be undone")) return;

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
    //if (!confirm("Clear entire history? This action cannot be undone")) return;
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
    v.hideItem(d.querySelector(".result-container"), d.querySelector(".footer-container"));
}

function showHistoryArea() {
    v.showItem(d.querySelector(".result-container"), d.querySelector(".footer-container"));
}

function raiseEdit(event) {
    event.preventDefault();
    editInput = event.target;
    editInput.addEventListener("keyup", event => {
        if (event.keyCode === 13) {
            d.body.click();
        }
    });
    console.log(editInput);
    currentInputValue = editInput.innerHTML;
    editInput.innerHTML = `<input class="edit-list-item"  style="width:100%;" />`;
    d.querySelector(".edit-list-item").focus();
    d.querySelector(".edit-list-item").value = currentInputValue;
}

function saveEdit(event) {    
    event.preventDefault();    
    const editListItem = d.querySelector(".edit-list-item") ? d.querySelector(".edit-list-item") : "";
    if (!editListItem) return;
    if (!editListItem.contains(event.target)) {
        editInput.innerHTML = editListItem.value ? editListItem.value : currentInputValue;
    }
}

hideHistoryArea();
if (ips.length) {
    showHistoryArea();
    renderHTML();
}//initialize history if any

