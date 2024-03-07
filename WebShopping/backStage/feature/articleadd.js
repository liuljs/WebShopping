// 宣告要帶入的欄位
let add_sort = $('.add_sort'), add_tit = $('.add_tit'), add_titImg = $('.add_titImg'), add_classify = $('.add_classify'), add_brief = $('.add_brief'), add_titCnts = $('.add_titcnts'), titImages = $('.titImages');
let classifies = $('.classifies');
let btnReset = $('.btnReset'), btnAddArt = $('.btnAddArt');
let enabled = 1; // 預設文章為顯示 
CONNECT = 'ArticleContent';
// 驗證
function dataUpdateCheck(aId, id, file, classify, brief, contentz) {
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
    if (file.val().trim() === '') {
        file.focus();
        $(document).scrollTop(0); // 置頂
        return check = false, errorText = '請確認有選擇上傳的封面圖！';
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
        return check = false, errorText = '請確認文章內容有確實填寫！';
    }
    else {
        return check = true, errorText = "";
    }
};
$().ready(function () {
    // 文章分類
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `ArticleCategory`,
        "QUERYs": "",
        "Counts": listSize,
        "Sends": "",
    };
    getPageDatas(dataObj).then(res => {
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
    // Reset 重置
    btnReset.on('click', function (e) {
        e.preventDefault()
        if (confirm("您確定要將目前編輯的內容全部清空嗎？")) {
            // 清空標題
            add_tit.val('');
            // 清空封面圖
            add_titImg.val('');
            // 回復預設
            titImages.html(`
                <div class="sampleImages">
                    <img src="./img/elements/imageIcon.png" alt="">
                </div>
            `);
            classifies.val('preset');
            // 清空簡述
            add_brief.val('');
            // 清空編輯器
            let cntsLen = quill.getLength();
            quill.deleteText(0, cntsLen);

            $(document).scrollTop(0); // 置頂
        };
    });
    // Top
    add_sort.on('change', function () {
        if ($(this).prop('checked') == true) {
            $(this).val('Y');
        } else {
            $(this).val('N');
        };
    });
    // 上傳圖片 取得圖片路徑
    add_titImg.on('change', function () {
        let file = $(this);
        if (imgUpdateCheck(file)) {
            if (window.URL !== undefined) {
                let url = window.URL.createObjectURL(file[0].files[0]);
                let currentImages = `
                    <img class="titImg" src="${url}">
                `;
                titImages.html(currentImages);
            };
        };
    });
    // Add 新增
    btnAddArt.on('click', function (e) {
        e.preventDefault();
        // 驗證
        dataUpdateCheck(idz, add_tit, add_titImg, add_classify, add_brief, quill);
        if (check == true) {
            // 取得圖片的名稱包成陣列
            let file = $('.ql-editor').find('img');
            if (file) {
                fNameArr = [];
                for (let i = 0; i < file.length; i++) {
                    fNameArr.push(file.eq(i).attr('src').split('/').pop());
                };
            } else {
                fNameArr = [];
            };
            // 將要新增的文章內容傳送至後台資料庫中儲存
            let dataObj = new FormData();
            dataObj.append('first', add_sort.val());
            // dataObj.append('Sort', "0"); // 排序不做使用：不做拋接
            dataObj.append('title', add_tit.val());
            dataObj.append('file', add_titImg[0].files[0]);
            dataObj.append('article_category_id', add_classify.val());
            dataObj.append('brief', add_brief.val());
            dataObj.append('Enabled', enabled);
            dataObj.append('content', JSON.stringify(quill.getContents()));
            dataObj.append('fNameArr', fNameArr);
            if (confirm("您確定要新增這則文章嗎？")) {
                // 傳送
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 201) {
                        alert("新增文章成功！");
                        // location.href = './articlelist.html';
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                        // getLogout();
                    };
                };
                xhr.open('POST', `${URL}${CONNECT}`, true);
                // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(dataObj);
            };
        } else {
            alert(errorText);
        };
    });
    // 在編輯器點擊圖片上傳，選擇好圖片時就上傳並且能夠以路徑的URL預覽
    let addImg = $('#add_cntsImg');
    let toolbar = quill.getModule('toolbar');
    toolbar.addHandler("image", function () { // 將 quill 編輯器的圖片功能轉為自訂義圖片上傳
        addImg.click();
        addImg.on('change', function () {
            let file = $(this);
            if (imgUpdateCheck(file)) {
                // 2. 圖片格式為路徑：在編輯器點擊圖片上傳，選擇好圖片時就上傳並且回傳路徑用以預覽
                let dataObj = new FormData();
                dataObj.append('file', file[0].files[0]);
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 201) {
                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                            let callBackData = JSON.parse(xhr.responseText);
                            // 獲取編輯器當前 focus 的位置
                            let selection = quill.getSelection(true);
                            // 調用函式 insertEmbed 將圖片顯示於編輯器上
                            quill.insertEmbed(selection.index, 'image', callBackData.Image_Url); // path 為回傳值的路徑
                        };
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                    };
                };
                xhr.open('POST', `${URL}${CONNECT}/AddContentImage`, true);
                // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                xhr.send(dataObj);

                file.val(''); // 重置檔案上傳欄位的內容，避免重複出現預覽圖片
            }
        });
    });
});