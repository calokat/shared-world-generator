let newWorldBtn = document.querySelector('#newWorld');
let enterWorldBtn = document.querySelector("#enterWorld");
let idField = document.querySelector("#idField");
let errorDisplay = document.querySelector("#error");
window.onload = () => {
    newWorldBtn.addEventListener('click', () => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/new');
        xhr.onload = () => {
            // With help from https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
            window.location.replace(window.location.href + `engine?id=${xhr.responseText}`);
        }
        xhr.send();
    });
    enterWorldBtn.addEventListener('click', () => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `/getScene?id=${idField.value}`);
        xhr.onload = () => {
            let jsonResponse = JSON.parse(xhr.response);
            if (!jsonResponse.errorCode) {
                window.location.replace(window.location.href += `engine?id=${idField.value}`);
            }
            // Thanks to https://www.w3schools.com/js/tryit.asp?filename=tryjs_visibility for a quick refresher
            else {
                errorDisplay.style.visibility = "visible";
            }
        }
        xhr.send();
    });
}