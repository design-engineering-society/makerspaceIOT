var equipment =
    [
        { name: "Prusa A1", model: "Prusa" },
        { name: "Prusa A2", model: "Prusa" },
        { name: "Prusa A3", model: "Prusa" },
        { name: "Prusa A4", model: "Prusa" },
        { name: "Prusa B1", model: "Prusa" },
        { name: "Prusa B2", model: "Prusa" },
        { name: "Prusa B3", model: "Prusa" },
        { name: "Prusa B4", model: "Prusa" },
        { name: "Prusa C1", model: "Prusa" },
        { name: "Prusa C2", model: "Prusa" },
        { name: "Prusa C3", model: "Prusa" },
        { name: "Prusa C4", model: "Prusa" },
        { name: "Ultimaker 1", model: "Ultimaker" },
        { name: "Ultimaker 2", model: "Ultimaker" },
        { name: "Markforged", model: "Markforged" },
        { name: "Formlabs", model: "Formlabs" },
        { name: "Lasercutter", model: "Lasercutter" },
        { name: "Vinylcutter", model: "Vinylcutter" },
        { name: "Roland CNC", model: "Roland CNC" },
        { name: "Stepcraft CNC", model: "Stepcraft CNC" }
    ];

function generateEqupmentTable() {

    var grid = document.getElementById("equipment_grid");
    for (var i = 0; i < equipment.length; i++) {

        var cell = createElem("DIV", [["class", "equipment_cell"], ["onclick", `testClick("${equipment[i]["name"]}")`]], grid);
        var cellTop = createElem("DIV", [["class", "equipment_cell_top"]], cell);
        var cellImg = createElem("IMG", [["class", "equipment_image"], ["src", loadImage(equipment[i]["model"])]], cellTop);
        var cellBottom = createElem("DIV", [["class", "equipment_cell_bottom"], ["innerHTML", equipment[i]["name"]]], cell);
    }
}

function loadImage(model) {

    switch (model) {
        case "Prusa": return "../User_UI/Icons/CE_Prusa.svg";
        case "Ultimaker": return "../User_UI/Icons/CE_Ultimaker.svg";
        case "Markforged": return "../User_UI/Icons/CE_Markforged.svg";
        case "Formlabs": return "../User_UI/Icons/CE_Formlabs.svg";
        case "Lasercutter": return "../User_UI/Icons/CE_Lasercutter.svg";
        case "Vinylcutter": return "../User_UI/Icons/CE_Vinylcutter.svg";
        case "Roland CNC": return "../User_UI/Icons/CE_CNC_Roland.svg";
        case "Stepcraft CNC": return "../User_UI/Icons/CE_CNC_Stepcraft.svg";
        default: return "nah";
    }
}

function createElem(type, attributes, parent) {
    var elem = document.createElement(type);
    for (var atr = 0; atr < attributes.length; atr++) {
        if (attributes[atr][0] == "innerHTML") {
            elem.innerHTML = attributes[atr][1];
        } else if (attributes[atr][0] == "value") {
            elem.value = attributes[atr][1];
        } else {
            elem.setAttribute(attributes[atr][0], attributes[atr][1]);
        }
    }
    if (parent == "body") {
        document.body.appendChild(elem);
    } else if (parent != "") {
        parent.appendChild(elem);
    }
    return elem
}

function testClick(str) {
    console.log(str);
}