var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/";
var ESPDoc;

function testing() {
    console.log("IT WORKED! :DDD!!!");
}

function print(word) {
    console.log(word);
}

function start() {

    MongoClient.connect(mongoURL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("makerspace");
        dbo.collection("ESP").find({}).toArray((err, result) => {
            if (err) throw err;
            ESPDoc = result[0];
            db.close();
        });
    });

    addESP('3D Printer Rack 1', '3D Printer 1', '3D Printer 2', '3D Printer 3', '3D Printer 4');
    addESP('3D Printer Rack 2', '3D Printer 5', '3D Printer 6', '3D Printer 7', '3D Printer 8');
    addESP('3D Printer Rack 3', '3D Printer 9', '3D Printer 10', '3D Printer 11', '3D Printer 12');
    addESP('3D Printer Rack 4', '3D Printer 13', '3D Printer 14', '3D Printer 15', '3D Printer 16');
}

function addESP(ESPLbl, plug1Lbl, plug2Lbl, plug3Lbl, plug4Lbl)  {
    addDisplayElement("ESP", ESPLbl);
    addDisplayElement("", plug1Lbl);
    addDisplayElement("", plug2Lbl);
    addDisplayElement("", plug3Lbl);
    addDisplayElement("", plug4Lbl);
}

function addDisplayElement(divClass, btnLbl) {
    var div = document.createElement("DIV");
    if (divClass != "") {
        div.setAttribute("class", divClass);
    }
    var btn = document.createElement("BUTTON");
    btn.innerHTML = btnLbl;
    btn.setAttribute("class", "dashboardBtn");
    btn.setAttribute("onclick", "addPopup()");//`print("${btnLbl}")`);
    div.appendChild(btn);
    document.getElementById("grid").appendChild(div);
}

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

function addPopup(ESPDoc) {

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
    createPopupLbl(popupGrid, "ESP IP:", ESPDoc["IP"]);
    createPopupLbl(popupGrid, "Router IP:", "192.168.0.254");
    createPopupLbl(popupGrid, "Master IP:", "192.168.0.110");
    createPopupLbl(popupGrid, "ESP Label:", "3D Printer Rack 1");
    createPopupLbl(popupGrid, "Plug 1 Label:", "3D Printer 1");
    createPopupLbl(popupGrid, "Plug 2 Label:", "3D Printer 2");
    createPopupLbl(popupGrid, "Plug 3 Label:", "3D Printer 3");
    createPopupLbl(popupGrid, "Plug 4 Label:", "3D Printer 4");

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