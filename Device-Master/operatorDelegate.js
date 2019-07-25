function testing() {
    console.log("IT WORKED! :DDD!!!");
}

function print(word) {
    console.log(word);
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
    btn.setAttribute("class", "nbutton");
    btn.setAttribute("onclick", "addPopup()");//`print("${btnLbl}")`);
    div.appendChild(btn);
    document.getElementById("grid").appendChild(div);
}

function start() {

    /*document.body.onkeyup = function(e){
        if(e.keyCode == 32){
            console.log("space pressed");
            //testing();
            addPopup();
        }
    }*/

    addESP('3D Printer Rack 1', '3D Printer 1', '3D Printer 2', '3D Printer 3', '3D Printer 4');
    addESP('3D Printer Rack 2', '3D Printer 5', '3D Printer 6', '3D Printer 7', '3D Printer 8');
    addESP('3D Printer Rack 3', '3D Printer 9', '3D Printer 10', '3D Printer 11', '3D Printer 12');
    addESP('3D Printer Rack 4', '3D Printer 13', '3D Printer 14', '3D Printer 15', '3D Printer 16');
}

function addPopup() {

    var div = document.createElement("DIV");
    div.setAttribute("id", "popup");
    div.setAttribute("onclick", "removePopup()");
    document.body.appendChild(div);
}

function removePopup() {
    var element = document.getElementById("popup");
    element.parentNode.removeChild(element);
}