// TATTOO
let tattoos = $('#editorz');
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    // TATTOO
    html = quill.setContents(JSON.parse(data.Content).ops);
    tattoos.html(quill.root.innerHTML);
};
// NOTFOUND
function fails() { };

$().ready(function () {
    // 
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": "Other1",
        "QUERYs": "",
        "Sends": "",
        "Counts": ""
    };
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            process(res);
        } else {
            fails();
        };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });
});