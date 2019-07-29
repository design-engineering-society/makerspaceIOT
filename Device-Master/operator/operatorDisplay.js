//var MongoClient = require('mongodb').MongoClient;
//var mongoURL = "mongodb://localhost:27017/";
//var ESPDoc;

function testing() {
    console.log("IT WORKED! :DDD!!!");
}

function print(word) {
    console.log(word);
}

function addESP(id, ESPLbl, plug1Lbl, plug2Lbl, plug3Lbl, plug4Lbl)  {
    addDisplayElement("ESP", ESPLbl, id);
    addDisplayElement("plug", plug1Lbl, id);
    addDisplayElement("plug", plug2Lbl, id);
    addDisplayElement("plug", plug3Lbl, id);
    addDisplayElement("plug", plug4Lbl, id);
}

function addDisplayElement(divClass, btnLbl, id) {
    var div = document.createElement("DIV");
    if (divClass != "") {
        div.setAttribute("class", divClass);
    }
    div.setAttribute("id", id);
    var btn = document.createElement("BUTTON");
    btn.innerHTML = btnLbl;
    btn.setAttribute("class", "dashboardBtn");
    btn.setAttribute("onclick", `addPopup(${id})`);//`print("${btnLbl}")`);
    div.appendChild(btn);
    document.getElementById("grid").appendChild(div);
}


/////////////////////////// POPUP ////////////////////////////////////////

function createPopupLbl(popupGrid, labelTxt, inputTxt) {

    div = document.createElement("DIV");
    div.setAttribute("class", "popupLabel");
    div.innerHTML = labelTxt;
    popupGrid.appendChild(div);

    var wrap = document.createElement("DIV");
    wrap.setAttribute("class", "popupInputWrapper");
    popupGrid.appendChild(wrap);
    div = document.createElement("INPUT");
    div.setAttribute("class", "popupInput");
    div.value = inputTxt;
    wrap.appendChild(div);
}

function addPopup(ESPDocID) {

    var ESPDoc = ESPdata[ESPDocID];

    // Setup
    var popupWrapper = document.createElement("DIV");
    popupWrapper.setAttribute("id", "popupWrapper");
    document.body.appendChild(popupWrapper);

    var popupBack = document.createElement("DIV");
    popupBack.setAttribute("id", "popupBack");
    popupBack.setAttribute("onclick", "removePopup()");
    popupWrapper.appendChild(popupBack);

    var popupPanel = document.createElement("DIV");
    popupPanel.setAttribute("id", "popupPanel");
    popupWrapper.appendChild(popupPanel);

    // Form
    var popupGrid = document.createElement("DIV");
    popupGrid.setAttribute("class", "popupGrid");
    popupPanel.appendChild(popupGrid);

    // Title
    var div = document.createElement("DIV");
    div.setAttribute("id", "popupTitle");
    div.innerHTML = "ESP Config Info";
    popupGrid.appendChild(div);

    // Form Elements
    createPopupLbl(popupGrid, "ESP Label:", ESPDoc["description"]);
    createPopupLbl(popupGrid, "Plug 1 Label:", ESPDoc["plug1Lbl"]);
    createPopupLbl(popupGrid, "Plug 2 Label:", ESPDoc["plug2Lbl"]);
    createPopupLbl(popupGrid, "Plug 3 Label:", ESPDoc["plug3Lbl"]);
    createPopupLbl(popupGrid, "Plug 4 Label:", ESPDoc["plug4Lbl"]);
    createPopupLbl(popupGrid, "ESP IP:", ESPDoc["IP"]);
    createPopupLbl(popupGrid, "Router IP:", ESPDoc["routerIP"]);
    createPopupLbl(popupGrid, "Master IP:", ESPDoc["masterIP"]);

    var wrap = document.createElement("DIV");
    wrap.setAttribute("id", "popupUpdateButtonWrapper");
    popupGrid.appendChild(wrap);

    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Update";
    btn.setAttribute("id", "popupUpdateButton");
    //btn.setAttribute("onclick", "addPopup()");
    wrap.appendChild(btn);

    unfade(popupWrapper);
}

function removePopup() {
    var element = document.getElementById("popupWrapper");
    
    var op = 1;  // initial opacity
    var inc = 0.08;
    //element.style.display = 'block';
    var timer = setInterval(function () {
        if (op <= 0){
            element.parentNode.removeChild(element);
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= inc;
    }, 8);
}

function unfade(element) {
    var op = 0;  // initial opacity
    var inc = 0.08;
    //element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += inc;
    }, 8);
}

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function reloadDisplay() {

    removeElementsByClass("ESP");
    removeElementsByClass("plug");

    var i;
    for (i = 0; i < Object.keys(ESPdata).length; i++) { 
        addESP(i, ESPdata[i]["description"], ESPdata[i]["plug1Lbl"], ESPdata[i]["plug2Lbl"], ESPdata[i]["plug3Lbl"], ESPdata[i]["plug4Lbl"]);
    }
}