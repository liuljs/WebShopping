// ABOUTS
let abouts = $('#editorz');
$().ready(function () {
    // 
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": "AboutMe",
        "QUERYs": "",
        "Sends": "",
        "Counts": ""
    };
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            html = "";
            html = quill.setContents(JSON.parse(res[0].Content).ops);
            abouts.html(quill.root.innerHTML);
        } else { };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });
});