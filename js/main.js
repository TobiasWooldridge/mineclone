document.addEventListener('DOMContentLoaded', function main() {

    request('GET', './objects/teapot.obj', function (xhr) {
        var model = parseObj(xhr.responseText);
        start({ 'bunny' : model });
    });

}, false);