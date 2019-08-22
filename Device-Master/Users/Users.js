function Users_loadFunction() {
    loadUsers();
}

function loadUsers() { // Requests to load all the ESP data from the database

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} Users(s) from database`);

            } else {
                data = [];
                console.log("No Users found");
            }
            refreshTable("Users");
        }
    };

    xhr.open('GET', `http://${serverIP}/loadUsers`, true); // Retrive ESP data
    xhr.send();
}