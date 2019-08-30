function testStorage() {

    var title = document.getElementsByClassName("header_title")[0];

    var equipmentSelectionData = JSON.parse(sessionStorage.equipmentSelectionData);
    var equipment = JSON.parse(sessionStorage.equipment);

    for (var i = 0; i < equipment.length; i++) {
        if (equipmentSelectionData["equipment_id"] == equipment[i]["id"]) {
            title.innerHTML = `The selected item was: ${equipment[i]["name"]}`;
            break;
        }
    }
}