// Privacy
let privacies = $('#editorz');
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    // Privacy
    html = quill.setContents(JSON.parse(data[0].Content).ops);
    privacies.html(quill.root.innerHTML);
};
// NOTFOUND
function fails() { };

$().ready(function () {
    // Privacy
    let dataObj = {
        "Methods": "GET", // 方法
        "APIs": URL, // API
        "CONNECTs": "Privacy", // CONNECT
        "QUERYs": "",
        "Sends": "", // 傳送篩選的條件物件(1. 預設傳送條件為顯示第一頁 2. GET 方法可 Null)
        "Counts": "" // 頁面顯示筆數
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
