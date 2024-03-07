// 宣告要帶入的欄位
let edit_sort = $('.edit_sort'), edit_tit = $('.edit_tit'), edit_titImg = $('.edit_titImg'), titImages = $('.titImages'), titImg = $('.titImg'), edit_classify = $('.edit_classify'), edit_brief = $('.edit_brief');
let classifies = $('.classifies');
let btnBackOrg = $('.btnBackOrg'), orgImg, orgTop, orgSort, orgTitle, orgClassify, orgBrief, orgStatus, orgContent; // 排序不做使用：不做拋接
let edit_status = $('.edit_status');
let btnReturn = $('.btnReturn'), btnReset = $('.btnReset'), btnSaveAts = $('.btnSaveAts');

CONNECT = "ArticleContent";
// 接收資料，做渲染、處理
function process(data) {
    // 原資料
    orgImg = data.image_name + '?editz', orgTop = data.First, orgTitle = data.title, orgClassify = data.article_category_id, orgBrief = data.brief, orgStatus = data.Enabled, orgContent = data.content;
    // 置頂狀態
    edit_sort.val(data.First);
    //顯示封面圖片
    titImg.attr('src', orgImg);
    // 標題
    edit_tit.val(data.title);
    // 類別
    edit_classify.val(data.article_category_id)
    // 簡述
    edit_brief.val(data.brief);
    // 顯示狀態
    edit_status.val(data.Enabled);
    // 將取得的內容渲染至編輯頁面上
    quill.setContents(JSON.parse(data.content).ops);
    // 順序是否有置頂
    let sort = $('.edit_sort');
    for (let i = 0; i < sort.length; i++) {
        if (sort.eq(i).val() == "Y") {
            sort.eq(i).prop('checked', true);
        } else {
            sort.eq(i).prop('checked', false);
        };
    };
    // 顯示狀態
    let chk = $('.edit_status');
    for (let i = 0; i < chk.length; i++) {
        if (chk.eq(i).val() == "1") {
            chk.eq(i).prop('checked', true);
        } else {
            chk.eq(i).prop('checked', false);
        };
    };
};
// 驗證
function dataUpdateCheck(aId, id, classify, brief, contentz) {
    if (aId.trim() === '') {
        id.focus();
        $(document).scrollTop(0); // 置頂
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    }
    if (id.val().trim() === '') {
        id.focus();
        $(document).scrollTop(0); // 置頂
        return check = false, errorText = '請確認標題欄位有確實填寫！';
    }
    if (classify.val().trim() === 'preset') {
        classify.focus();
        $(document).scrollTop(0); // 置頂
        return check = false, errorText = '請確認類別欄位有確實填寫！';
    }
    if (brief.val().trim() === '') {
        brief.focus();
        $(document).scrollTop(0); // 置頂
        return check = false, errorText = '請確認簡述欄位有確實填寫！';
    }
    if (contentz.getLength() === 1) {
        $(document).scrollTop(0); // 置頂
        return check = false, errorText = '請確認消息內容有確實填寫！';
    }
    else {
        return check = true, errorText = "";
    }
};
$().ready(function () {
    // 取得類別
    let clsObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `ArticleCategory`,
        "QUERYs": "",
        "Counts": listSize,
        "Sends": "",
    };
    getPageDatas(clsObj).then(res => {
        console.log(res)
        // DOSOMETHING
        html = `<option value="preset" selected>選擇分類</option>`;
        if (res !== null) {
            for (let i = 0; i < res.length; i++) {
                html += `
                    <option value="${res[i].id}">${res[i].name}</option>
                `;
            };
        };
        classifies.html(html);
    }, rej => {
        alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
        // getLogout();
    });
    // 從 localStorage 取編號，用於呼叫要修改的訊息
    let num = localStorage.getItem('atsNum');
    if (num) {
        //
        let dataObj = {
            "Methods": "GET",
            "APIs": URL,
            "CONNECTs": `${CONNECT}/${num}`,
            "QUERYs": "",
            "Counts": listSize,
            "Sends": "",
        };
        //
        getPageDatas(dataObj).then(res => {
            console.log(res)
            // DO SOMETHING
            if (res !== null) {
                process(res);
            } else { };
        }, rej => { });
    };
    // Top
    edit_sort.on('change', function () {
        if ($(this).prop('checked') == true) {
            $(this).val('Y');
        } else {
            $(this).val('N');
        };
    });
    // 顯示狀態控制
    edit_status.on('change', function () {
        if ($(this).prop('checked') == true) {
            $(this).val("1");
        } else {
            $(this).val("0");
        }
    });
    // 上傳圖片 取得圖片路徑    
    edit_titImg.on('change', function () {
        let file = $(this);
        if (imgUpdateCheck(file)) {
            if (window.URL !== undefined) {
                let url = window.URL.createObjectURL(file[0].files[0]);
                let currentImages = `
                    <img class="titImg" src="${url}">
                `;
                titImages.html(currentImages);
            };
        }
    });
    // 回復原圖
    btnBackOrg.on('click', function () {
        if (orgImg !== "") {
            $('.titImg').attr('src', orgImg);
            edit_titImg.val('');
        };
    });
    // 在編輯器點擊圖片上傳，選擇好圖片時就上傳並且能夠以路徑的URL預覽
    let addImg = $('#edit_cntsImg');
    let toolbar = quill.getModule('toolbar');
    toolbar.addHandler("image", function () { // 將 quill 編輯器的圖片功能轉為自訂義圖片上傳
        addImg.click();
        addImg.on('change', function () {
            let file = $(this);
            if (imgUpdateCheck(file)) {
                // 圖片格式為路徑：在編輯器點擊圖片上傳，選擇好圖片時就上傳並且回傳路徑用以預覽
                let dataObj = new FormData();
                dataObj.append('id', num)
                dataObj.append('file', file[0].files[0]);

                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 201) {
                        if (xhr.responseText !== "") {
                            let callBackData = JSON.parse(xhr.responseText);
                            // 獲取編輯器當前 focus 的位置
                            let selection = quill.getSelection(true);
                            // 調用函式 insertEmbed 將圖片顯示於編輯器上
                            quill.insertEmbed(selection.index, 'image', callBackData.Image_Url); // path 為回傳值的路徑

                        } else {
                            alert(callBackData.Content);
                        }
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                    };
                };
                xhr.open('POST', `${URL}${CONNECT}/AddContentImage/${num}`, true);
                // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                xhr.send(dataObj);

                file.val(''); // 重置檔案上傳欄位的內容，避免重複出現預覽圖片
            }
        });
    });
    // Reset 重置
    btnReset.on('click', function () {
        if (confirm("您確定要重置為原本的內容嗎？")) {
            // 置頂狀態
            edit_sort.val(orgTop);
            if (edit_sort.val() == "Y") {
                edit_sort.prop('checked', true);
            } else {
                edit_sort.prop('checked', false);
            };
            // 原標題
            edit_tit.val(orgTitle);
            // 原類別
            edit_classify.val(orgClassify)
            // 原簡述
            edit_brief.val(orgBrief);
            // 清空已設的封面圖
            edit_titImg.val('');
            // 回復原圖
            if (orgImg !== "") {
                $('.titImg').attr('src', orgImg);
            };
            // 顯示狀態
            edit_status.val(orgStatus);
            if (edit_status.val() == "1") {
                edit_status.prop('checked', true);
            } else {
                edit_status.prop('checked', false);
            };
            // 原編輯器內容
            quill.setContents(JSON.parse(orgContent).ops);

            $(document).scrollTop(0); // 置頂
        };
    });
    // Save 儲存
    btnSaveAts.on('click', function (e) {
        e.preventDefault();
        // 驗證
        dataUpdateCheck(idz, edit_tit, edit_classify, edit_brief, quill);
        if (check == true) {
            // 取得圖片的名稱包成陣列
            let file = $('.ql-editor').find('img');
            if (file) {
                fNameArr = [];
                for (let i = 0; i < file.length; i++) {
                    fNameArr.push(file.eq(i).attr('src').split('/').pop());
                };
            };
            // 將要新增的消息內容傳送至後台資料庫中儲存
            let dataObj = new FormData();
            dataObj.append('id', num);
            dataObj.append('First', edit_sort.val());
            dataObj.append('title', edit_tit.val());
            dataObj.append('file', edit_titImg[0].files[0]);
            dataObj.append('article_category_id', edit_classify.val());
            dataObj.append('brief', edit_brief.val());
            dataObj.append('Enabled', edit_status.val());
            dataObj.append('content', JSON.stringify(quill.getContents()));
            dataObj.append('fNameArr', fNameArr);
            if (confirm("您確定要儲存這次修改的內容嗎？")) {
                // 傳送
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert("修改文章成功！");
                        location.href = './articlelist.html';
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！")
                    };
                };
                xhr.open('PUT', `${URL}${CONNECT}/${num}`, true);
                // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(dataObj);
            };
        } else {
            alert(errorText);
        };
    });
    // 返回
    btnReturn.on('click', function () {
        if (confirm("您填寫的內容可能不會進行儲存，確定要回到上一頁嗎？")) {
            window.history.go(-1);
        };
    });
});