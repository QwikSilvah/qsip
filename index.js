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

let timeDisplay = 0;
let editInput;
let currentInputValue;

const v = {
    list: d.querySelector(".list"),
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
//d.body.addEventListener("click", removeItem);

v.reset.addEventListener("click", resetInputArea);

v.extractButton.addEventListener("click", extract);

//v.time.addEventListener("mouseover", showTime);
v.time.addEventListener("click", toggleTimeDisplay);
v.previous.addEventListener("click", showPrevious);
v.next.addEventListener("click", showNext);

v.historyEdit.addEventListener("click", editHistory);
v.historyRemove.addEventListener("click", removeHistoryItem);
v.historyClear.addEventListener("click", clearHistory);

d.body.addEventListener("click", saveEdit);


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
    //newItem.classList.add("");
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
    //if (editListItem) {
    //    saveEdit();
    //}
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

    v.time.innerHTML = `${ext.howLongAgo(time)} (${currentStorageIndex + 1}/${ips.length})`;    
        
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
}

function onRemove() {
    if (getList().length <= 2) {
        v.selections.setAttribute("disabled", "true");
        v.extractButton.setAttribute("disabled", "true");
    }
    v.total.innerHTML = getList().length;
}

function onChange() {
    const list = getList();
    const listLength = list.length
    const attribValue = listLength - 1;
    v.selections.setAttribute("max", attribValue);
    //if (getList().length > 2) {
    //    v.selections.value = getList().length - 1;
    //}
    v.total.innerHTML = listLength;

    if (list.length) {
        for (element of list) {
            //console.log(element, element.firstChild);
            element.firstChild.addEventListener("dblclick", raiseEdit);
        }
        v.reset.removeAttribute("disabled");
    }
    else {
        v.reset.setAttribute("disabled", "true");
    }

    //v.input.setAttribute("autofocus", "true");
    v.input.focus();

    for (element of d.querySelectorAll(".close-btn")) {
        element.addEventListener("click", removeItem, false);
    }

    console.log("onChange called");
}

function resetInputArea() {
    if (!confirm("Clear items?")) return;

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
        header: `Unable to handle your request.`,
        content: `Please make sure you entered everything correctly.`,
        reject: "Ok"
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
    v.input.focus();
    v.reset.removeAttribute("disabled");

    onChange();
}

function showEditAlert() {
    const alertBox = d.createElement("div");
    d.querySelector(".container.main").prepend(alertBox);
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
    if (!confirm("Remove item? This action cannot be undone")) return;

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
    if (!confirm("Clear entire history? This action cannot be undone")) return;
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

function raiseEdit(event) {
    event.preventDefault();
    editInput = event.target;
    editInput.addEventListener("keyup", event => {
        //event.preventDefault();        
        if (event.keyCode === 13) {
            d.body.click();
        }
    });
    console.log(editInput);
    currentInputValue = editInput.innerHTML;
    editInput.innerHTML = `<input class="edit-list-item"  style="width:100%;" autofocus />`;
    //editInput.click();
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

