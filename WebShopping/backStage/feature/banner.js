// 宣告要帶入的欄位
let banners = $('.banners');
let btnAddBnr = $('.btnAddBnr'), add_bnrImg = $('.add_bnrImg'), add_bnrUrl = $('.add_bnrUrl');
let setTop = "N"; // 預設為不置頂
// 驗證
function dataUpdateCheck(aId, name) {
    if (aId.trim() === '') {
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    }
    if (name.val().trim() === '') {
        name.focus();
        return check = false, errorText = '請確認有選擇要上傳的輪播圖片！';
    }
    else {
        return check = true, errorText = "";
    }
};
$().ready(function () {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            if (xhr.responseText !== "") {
                let callBackData = JSON.parse(xhr.responseText);
                html = "";
                for (let i = 0; i < callBackData.length; i++) {
                    html += `
                        <tr data-num="${callBackData[i].Id}">
                            <td data-title="編號">${i + 1}</td>
                            <td data-title="日期">${callBackData[i].Creation_Date.split(' ')[0]}</td>
                            <td data-title="圖片"><div class="bannerImgs"><img src="${callBackData[i].Image_Url}"></div></td>
                            <td data-title="連結">
                                <input type="text" class="form-control inputStatus edit_link" value="${callBackData[i].Image_Link}" disabled>
                            </td>
                            <td data-title="順序">
                                <div class="form-check">
                                    <label class="form-check-label mr-0">
                                        <input type="checkbox" class="form-check-input inputStatus edit_sort" value="${callBackData[i].First}" disabled>
                                        <span class="form-check-sign">置頂</span>
                                    </label>
                                </div>
                            </td>
                            <td data-title="功能">
                                <div class="setupBlock">
                                    <a class="btn btn-sm btn-warning btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a>
                                </div>
                            </td>
                        </tr>
                    `;
                };
                banners.html(html);
                // SetTop Status
                let sort = $('.edit_sort');
                for (let i = 0; i < sort.length; i++) {
                    if (sort.eq(i).val() == "Y") {
                        sort.eq(i).prop('checked', true);
                    } else {
                        sort.eq(i).prop('checked', false);
                    };
                };
                // Edit
                $(document).on('click', '.btnEdit', function (e) {
                    e.preventDefault(), e.stopPropagation();
                    let trz = $(this).parents('tr');
                    if ($('.setupBlock').hasClass('active')) {
                        alert('請您確認是否有其他的輪播資訊尚未儲存！');
                    }
                    else {
                        // Setup
                        trz.find('.setupBlock').addClass('active').html('').append(`
                            <a class="btn btn-success btn-sm btnSave" href="#"><i class="fal fa-save"></i> 存儲</a> 
                            <a class="btn btn-danger btn-sm btnDel" href="#"><i class="fas fa-trash"></i> 刪除</a>
                            <a class="btn btn-sm btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                        `);
                        // Original
                        let orgLink = trz.find('.edit_link').val(), orgStatus = trz.find('.edit_sort').val();
                        // Input Enable
                        trz.find('.inputStatus').prop('disabled', false);
                        // SetTop
                        trz.find('.edit_sort').on('change', function () {
                            if ($(this).prop('checked') == true) {
                                $(this).val('Y');
                            } else {
                                $(this).val('N');
                            };
                        });
                        // Save
                        trz.find('.btnSave').on('click', function (e) {
                            e.preventDefault();
                            let num = trz.data('num');
                            let dataObj = {
                                "id": num,
                                "image_link": trz.find('.edit_link').val(),
                                "first": trz.find('.edit_sort').val()
                            };
                            if (confirm('您確定要對這筆輪播資訊做修改嗎？')) {
                                let xhr = new XMLHttpRequest();
                                xhr.onload = function () {
                                    if (xhr.status == 200 || xhr.status == 204) {
                                        location.reload();
                                    } else {
                                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                    };
                                };
                                xhr.open('PUT', `${URL}IndexSlideshow/${num}`, true);
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.send($.param(dataObj));
                            };
                        })
                        // Delete
                        trz.find('.btnDel').on('click', function (e) {
                            e.preventDefault();
                            let num = trz.data('num')
                            let dataObj = {
                                "id": num
                            };
                            if (confirm("確定要刪除這筆輪播資訊嗎？")) {
                                let xhr = new XMLHttpRequest();
                                xhr.onload = function () {
                                    if (xhr.status == 200 || xhr.status == 204) {
                                        location.reload();
                                    } else {
                                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                    };
                                };
                                xhr.open('DELETE', `${URL}IndexSlideshow/${num}`, true)
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.send($.param(dataObj));
                            };
                        });
                        // Cancel
                        trz.find('.btnCancel').on('click', function (e) {
                            e.preventDefault();
                            if (confirm("您尚未儲存內容，確定要取消嗎？")) {
                                // 還原欄位資料
                                trz.find('.edit_link').val(orgLink), trz.find('.edit_sort').val(orgStatus);
                                if (trz.find('.edit_sort').val() == "Y") {
                                    trz.find('.edit_sort').prop('checked', true);
                                } else {
                                    trz.find('.edit_sort').prop('checked', false);
                                };
                                // 轉為編輯按鈕
                                trz.find('.setupBlock').removeClass('active').html('').append(`
                                    <a class="btn btn-sm btn-warning btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a>
                                `);
                                // 權限欄位的禁用、啟用
                                trz.find('.inputStatus').prop('disabled', true);
                            }
                        });
                    };
                });
            } else {
                html = "";
                html = `
                    <tr class="none">
                        <td colspan="6" class="none">
                            <span>目前沒有任何的輪播圖片。</span>
                        </td>
                    </tr> 
                `;
                banners.html(html);
            }
        } else {
            // getLogout();
        };
    };
    xhr.open('GET', `${URL}IndexSlideshow`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);

    add_bnrImg.on('change', function () {
        let file = $(this);
        imgUpdateCheck(file);
    });
    // 新增輪播圖
    btnAddBnr.on('click', function (e) {
        e.preventDefault();
        dataUpdateCheck(idz, add_bnrImg);
        if (check == true) {
            let dataObj = new FormData();
            dataObj.append("first", setTop);
            dataObj.append("image_link", add_bnrUrl.val());
            dataObj.append("file", add_bnrImg[0].files[0]);
            if (confirm("確定要新增這筆輪播資訊嗎？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 201) {
                        alert('新增成功！');
                        location.reload();
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                    };
                };
                xhr.open('POST', `${URL}IndexSlideshow`, true);
                // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                xhr.send(dataObj);
            };
        } else {
            alert(errorText);
        };
    });
});