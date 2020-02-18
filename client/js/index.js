let newWorldBtn = document.querySelector('#newWorld');

window.onload = () => {
    newWorldBtn.addEventListener('click', () => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/new');
        xhr.onload = () => {
            // With help from https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
            window.location.replace(window.location.href + `engine?id=${xhr.responseText}`);
        }
        xhr.send();
    })
}