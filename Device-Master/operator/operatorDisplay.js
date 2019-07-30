////////////////////////// Dashboard Display Cells /////////////////////////

function addESP(ip, ESPLbl, plug1Lbl, plug2Lbl, plug3Lbl, plug4Lbl)  {
    // Adds an active ESP to the dashboard, comprised of 5 display elements
    addDisplayElement("ESP", ESPLbl, `${ip}-ESP`, ip, "");
    addDisplayElement("plug", plug1Lbl, `${ip}-plug1`, ip, "1");
    addDisplayElement("plug", plug2Lbl, `${ip}-plug2`, ip, "2");
    addDisplayElement("plug", plug3Lbl, `${ip}-plug3`, ip, "3");
    addDisplayElement("plug", plug4Lbl, `${ip}-plug4`, ip, "4");
}

function addDisplayElement(divClass, btnLbl, id, ip, info) {
    // Adds an individual display element to the dashboard
    var wrap = document.createElement("DIV");
    wrap.setAttribute("class", divClass);
    wrap.setAttribute("id", id);

    var btn = document.createElement("BUTTON");
    btn.innerHTML = btnLbl;

    if (divClass == "ESP") {
        btn.setAttribute("class", "dashboardBtn ESPBtn");
        btn.setAttribute("onclick", `addPopup("${ip}")`);
    } else {
        btn.setAttribute("class", "dashboardBtn plugBtnOn");
        btn.setAttribute("onclick", `onOff("${ip}", "${info}")`);
    }
    wrap.appendChild(btn);
    document.getElementById("grid").appendChild(wrap);
}

/////////////////////////// POPUP ////////////////////////////////////////

function createPopupLbl(popupGrid, labelTxt, inputTxt) {
    // Creates a label and input element in the popup window
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

function addPopup(ip) {

    //var ip = ESPDocID.split("-")[0];
    var ESPDoc = ESPdata[ip];

    // Setup
    var popupWrapper = document.createElement("DIV");
    popupWrapper.setAttribute("id", "popupWrapper");
    document.body.appendChild(popupWrapper);

    var popupBack = document.createElement("DIV");
    popupBack.setAttribute("id", "popupBack");
    popupBack.setAttribute("onclick", "fadeOutPopup()");
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
    createPopupLbl(popupGrid, "ESP IP:", ip);
    createPopupLbl(popupGrid, "Router IP:", ESPDoc["routerIP"]);
    createPopupLbl(popupGrid, "Master IP:", ESPDoc["masterIP"]);

    var wrap = document.createElement("DIV");
    wrap.setAttribute("id", "popupUpdateButtonWrapper");
    popupGrid.appendChild(wrap);

    var updateBtn = document.createElement("BUTTON");
    updateBtn.innerHTML = "Update";
    updateBtn.setAttribute("id", "popupUpdateButton");
    wrap.appendChild(updateBtn);

    fadeInPopup(popupWrapper);
}

function fadeOutPopup() {
    var element = document.getElementById("popupWrapper");
    
    var op = 1;
    var inc = 0.08;
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

function fadeInPopup(element) {
    var op = 0;
    var inc = 0.08;
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += inc;
    }, 8);
}

////////////////////////// UTILITY //////////////////////////////

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function reloadDisplay(ip) {

    removeElementsByClass("ESP");
    removeElementsByClass("plug");

    for (const [ip, data] of Object.entries(ESPdata)) {
        addESP(ip, data["description"], data["plug1Lbl"], data["plug2Lbl"], data["plug3Lbl"], data["plug4Lbl"]);
      }
}

function changePlugColours(IP, plugInfo) {

    var plug1 = document.getElementById(`${IP}-plug1`).firstChild;
    setPlugColour(plug1, plugInfo["1"]);
    var plug2 = document.getElementById(`${IP}-plug2`).firstChild;
    setPlugColour(plug2, plugInfo["2"]);
    var plug3 = document.getElementById(`${IP}-plug3`).firstChild;
    setPlugColour(plug3, plugInfo["3"]);
    var plug4 = document.getElementById(`${IP}-plug4`).firstChild;
    setPlugColour(plug4, plugInfo["4"]);
}

function setPlugColour(plug, status) {
    //console.log(`plug status: ${status}`);

    if (status == "ON") {
        plug.setAttribute("class", "dashboardBtn plugBtnOn");
    } else  {
        plug.setAttribute("class", "dashboardBtn plugBtnOff");
    }
}

function switchPlugDisplay(ip, plugNum, status) {
    var plug = document.getElementById(`${ip}-plug${plugNum}`).firstChild;

    if (status == "ON") {
        plug.setAttribute("class", "dashboardBtn plugBtnOn");
    } else  {
        plug.setAttribute("class", "dashboardBtn plugBtnOff");
    }
}