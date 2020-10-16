function f() {
    let listContainer = document.getElementById("leftNav");
    // get all li w/ class name nav-item
    let listItems = listContainer.getElementsByClassName("nav-item");
    // Loop through the buttons and add the active class to the current/clicked button
    for (let i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener("click", function () {
            let current = listContainer.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }
}