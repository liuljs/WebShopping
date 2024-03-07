// 宣告要帶入的欄位
let edit_brief = $('.edit_brief'), edit_links = $('.edit_links');
let imgFile = $('.imgFile'), edit_picImag = $('.edit_picImag'), picLens = edit_picImag.length, imgArr = ["", "", "", "", "", "", "", "", "", ""]; // 圖片筆數
let btnSave = $('.btnSave');
CONNECT = "PictureList";
// 驗證
function dataUpdateCheck(aId, brief, links, images) {
    if (aId.trim() === '') {
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    };
    if (brief.val().trim() === '') {
        $('html,body').scrollTop(brief.parents('.row').offset().top - 80);
        return check = false, errorTitle = '基本資訊', errorText = '供請照簡述：請確認簡述欄位有確實填寫！';
    };
    if (links.val().trim() === '') {
        $('html,body').scrollTop(links.parents('.row').offset().top - 80);
        return check = false, errorTitle = '基本資訊', errorText = '連結網址：請確認連結網址有確實填寫！';
    }
    // 至少選擇上傳一張照片
    let result = images.every(e => e == null || e == "");
    if (result) {
        $('html,body').scrollTop(edit_picImag.parents('.row').offset().top - 80); // 上傳圖片的頂端位置
        return check = false, errorTitle = '基本資訊', errorText = '供請照：請至少上傳一張供請照！';
    }
    else {
        return check = true, errorText = "";
    };
};
$().ready(function () {
    // 
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": CONNECT,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            // 簡述
            edit_brief.val(res.Title);
            // 連結網址
            edit_links.val(res.More_Pic_Url);
            //
            let picArr = edit_picImag.parents('.fileinput');
            for (let i = 0; i < picLens; i++) { // 圖片筆數
                if (picLens - i >= picLens) {
                    if (res[`Picture${picLens - i}`] !== "" && res[`Picture${picLens - i}`] !== null) {
                        let picImgURL = `./img/PictureList/${res[`Picture${picLens - i}`]}`;
                        picArr.eq(i).addClass('fileinput-exists').removeClass('fileinput-new');
                        picArr.eq(i).find('.fileinput-preview').html(`<img src="${picImgURL}" alt="">`);
                        imgArr[picLens - 1 - i] = res[`Picture${picLens - i}`];
                    };
                } else {
                    if (res[`Picture0${picLens - i}`] !== "" && res[`Picture0${picLens - i}`] !== null) {
                        let picImgURL = `./img/PictureList/${res[`Picture0${picLens - i}`]}`;
                        picArr.eq(i).addClass('fileinput-exists').removeClass('fileinput-new');
                        picArr.eq(i).find('.fileinput-preview').html(`<img src="${picImgURL}" alt="">`);
                        imgArr[picLens - 1 - i] = res[`Picture0${picLens - i}`];
                    };
                };
            };
        } else { };
    }, rej => { });
    // 圖片驗證
    imgFile.on('change', function () {
        let file = $(this);
        let num = $(this).parents('.pics').index();
        if (file[0].files.length !== 0) {
            imgUpdateCheck(file); // 檢查
            imgArr[num] = file[0].files[0].name // 上傳檔案 紀錄圖片名稱
        };
    });
    // 如果清除圖片，就清除圖片紀錄
    $('.btnClrImg').on('click', function () {
        let num = $(this).parents('.pics').index();
        imgArr[num] = null // 清除檔案 紀錄 NULL
    });
    // 儲存
    btnSave.on('click', function () {
        // 驗證
        dataUpdateCheck(idz, edit_brief, edit_links, imgArr);
        if (check == true) {
            if (confirm("您確認要修改供請照嗎？")) {
                // 將要新增的資料放入 FormData
                let dataObj = new FormData();
                dataObj.append('Title', edit_brief.val().trim());
                dataObj.append("More_Pic_Url", edit_links.val().trim());
                for (let i = 0; i < edit_picImag.length; i++) { // 有放圖的話，沒有則為 NULL 
                    if (i < 9) { // 0 - 9 
                        if (edit_picImag[i].files[0] !== undefined) {
                            dataObj.append(`Picture0${i + 1}`, edit_picImag[i].files[0]);
                        } else { // 如果沒有就保持原來的 (原有圖片 或者 "")
                            dataObj.append(`Picture0${i + 1}`, imgArr[i]);
                        };
                    } else { // > 9
                        if (edit_picImag[i].files[0] !== undefined) {
                            dataObj.append(`Picture${i + 1}`, edit_picImag[i].files[0]);
                        } else { // 如果沒有就保持原來的 (原有圖片 或者 "")
                            dataObj.append(`Picture${i + 1}`, imgArr[i]);
                        };
                    };
                };
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert("修改供請照成功!");
                        // location.reload();
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                    };
                };
                xhr.open('PUT', `${URL}${CONNECT}`, true);
                // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                xhr.send(dataObj);
            };
        } else {
            // 提示
            $.notify({
                // options
                title: errorTitle,
                message: errorText
            }, {
                // settings
                type: 'danger',
                placement: {
                    from: "top",
                    align: "center"
                },
                offset: 40,
                delay: 600,
                timer: 2000,
            });
        };
    });
});