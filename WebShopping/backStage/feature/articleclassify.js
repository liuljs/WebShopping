// 宣告要帶入的欄位
let clsContents = $('.cls-contents');
let edits = $('.edits'), edits_content = $('.edits_content');
let primaries = $('.primaries');
let sec_max = 20;
let secs = "";
let minors = $('.minors');
let mins;
let clsMinArr = new Array(), clsAddArr = new Array(), clsDelArr = new Array();
let editaction, addClsId;

CONNECT = 'ArticleCategory';
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        html += `
            <div data-num="${data[i].id}" class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h3 class="w-100 text-primary mb-0 d-inline">主分類 0${i + 1}</h3>
                        <div class="form-group d-flex justify-content-end align-items-center py-1 pl-4 col-md-4">
                            <label class="mr-4">狀態</label>
                            <div class="custom-control custom-switch">
                                <input type="checkbox" id="primSwitch${i}" class="custom-control-input inputStatus edit_status edit_priStatus" value="${data[i].Enabled}" disabled>
                                <label class="custom-control-label" for="primSwitch${i}">開啟</label>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-wrap justify-content-between mt-3">
                        <div class="form-group d-flex align-items-center py-1 col-md-8">
                            <label class="mr-2">主分類名稱<span class="markz"></span></label>
                            <div class="input-group">
                                <input type="text" class="form-control inputStatus edit_priName" value="${data[i].name}" disabled>
                            </div>
                        </div>
                        <div class="form-group d-flex py-1 justify-content-end col-md-4">
                            <label class="mr-2 col-form-label">排序</label>
                            <input type="text" class="form-control text-right edit_sort inputStatus" value="${data[i].Sort}" disabled>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="setupBlock justify-content-end">
                        <a class="btn btn-warning btnEditPri" href="#"><i class="far fa-edit"></i> 編輯</a>
                    </div>
                </div>
            </div>
        `;
        secs = "";
    };
    primaries.html(html);
};
// NOTFOUND
function fails() {

};
// 驗證
function dataUpdateCheck(aId, name, sort) {
    if (aId.trim() === '') {
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    }
    if (name.val().trim() === '' || name.val().length > 20) {
        name.focus();
        return check = false, errorText = '請確認分類名稱是否確實填寫、長度不得超過20字元！';
    }
    if (sort.val().trim() === '') {
        sort.focus();
        return check = false, errorText = '請確認分類排序是否確實填寫！';
    } else if (NumberRegExp.test(sort.val().trim()) === false) {
        sort.focus();
        return check = false, errorText = '請確認分類排序是否為數字！';
    }
    else {
        return check = true, errorText = "";
    }
};
$().ready(function () {
    // 顯示新增、編輯功能（目前未設權限）
    if (this) {
        clsContents.prepend(`
            <div class="col-xl-4">
                <div class="card">
                    <div class="card-header d-flex  align-items-center">
                        <h2 class="text-primary d-inline mb-0">新增主分類</h2>
                        <span class="notes">（＊號為必填欄位）</span>
                    </div>
                    <div class="card-body">
                        <div class="form">
                            <div class="form-group px-0">
                                <label>名稱<span class="markz"></span></label>
                                <input type="text" class="form-control add_priName">
                            </div>
                            <div class="text-right my-3">
                                <button class="btn btn-primary btnAddPri">新增</button>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        `);
        // Add Prim
        $('.btnAddPri').on('click', function () {
            let add_priName = $('.add_priName');
            dataUpdateCheck(idz, add_priName,);
            if (check == true) {
                let dataObj = {
                    "name": add_priName.val(),
                    "Enabled": "1",
                }
                if (confirm("您確定要新增這個主分類嗎？")) {
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status == 200 || xhr.status == 201) {
                            alert("新增主分類成功！");
                            location.reload();
                        } else {
                            alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                        };
                    };
                    xhr.open('POST', `${URL}${CONNECT}`, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send($.param(dataObj));
                }
            } else {
                alert(errorText);
            }
        });
    };
    //
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": CONNECT,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
    //
    getPageDatas(dataObj).then(res => {
        console.log(res)
        // DOSOMETHING
        if (res !== null) {
            process(res);
            // 主分類、次分類狀態顯示
            let chk = $('.edit_status');
            for (let i = 0; i < chk.length; i++) {
                if (chk.eq(i).val() == "1") {
                    chk.eq(i).prop('checked', true);
                } else {
                    chk.eq(i).prop('checked', false);
                };
            };
            // Edit Primary
            $(document).on('click', '.btnEditPri', function (e) {
                e.preventDefault(), e.stopPropagation();
                let trz = $(this).parents('.card');
                let num = trz.data('num');
                if ($('.card-footer .setupBlock').hasClass('active')) {
                    alert('請確認是否有其他主分類尚未儲存！');
                } else {
                    // 欄位
                    trz.find('.card-footer .setupBlock').addClass('active').html('').append(`
                        <a class="btn btn-success btnSavePri" href="#"><i class="far fa-edit"></i> 儲存</a>
                        <a class="btn btn-danger btnDelPri" href="#"><i class="fas fa-trash"></i> 刪除</a>
                        <a class="btn btnCancel  ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                    `);
                    // 權限欄位的禁用、啟用
                    trz.find('.inputStatus').prop('disabled', false);
                    // 原資料
                    let orgPrimName = trz.find('.edit_priName').val(), orgPrimSort = trz.find('.edit_sort').val(), orgPrimStatus = trz.find('.edit_priStatus').val();
                    // Save Primary
                    $('.btnSavePri').on('click', function (e) {
                        e.preventDefault();
                        dataUpdateCheck(idz, trz.find('.edit_priName'), trz.find('.edit_sort'));
                        if (check == true) {
                            let dataObj = {
                                "id": num,
                                "name": trz.find('.edit_priName').val().trim(),
                                "Enabled": trz.find('.edit_priStatus').val().trim(),
                                "Sort": trz.find('.edit_sort').val().trim(),
                            };
                            console.log(dataObj)
                            if (confirm("確定要儲存這筆主分類的修改嗎？")) {
                                let xhr = new XMLHttpRequest();
                                xhr.onload = function () {
                                    if (xhr.status == 200 || xhr.status == 204) {
                                        alert("儲存成功！");
                                        location.reload();
                                    } else {
                                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                    };
                                };
                                xhr.open('POST', `${URL}${CONNECT}`, true);
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.send($.param(dataObj));
                            };
                        } else {
                            alert(errorText);
                        };
                    });
                    // Delete
                    $('.btnDelPri').on('click', function (e) {
                        e.preventDefault(); // 取消 a 預設事件
                        let dataObj = {
                            "id": num
                        };
                        if (confirm("您確定要刪除筆主分類嗎？")) {
                            let xhr = new XMLHttpRequest();
                            xhr.onload = function () {
                                if (xhr.status == 200 || xhr.status == 204) {
                                    alert("主分類刪除成功！");
                                    location.reload();
                                } else {
                                    alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                };
                            };
                            xhr.open('DELETE', `${URL}ArticleCategory/${num}`, true)
                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                            xhr.send($.param(dataObj));
                        }
                    });
                    // Cancel
                    trz.find('.btnCancel').on('click', function (e) {
                        e.preventDefault();
                        let trz = $(this).parents('.card');
                        if (confirm("尚未儲存更改的內容，確定要取消嗎？")) {
                            // 還原欄位原本資料
                            trz.find('.edit_priName').val(orgPrimName), trz.find('.edit_sort').val(orgPrimSort), trz.find('.edit_priStatus').val(orgPrimStatus);
                            if (trz.find('.edit_priStatus').val() == "1") {
                                trz.find('.edit_priStatus').prop('checked', true);
                            } else {
                                trz.find('.edit_priStatus').prop('checked', false);
                            };
                            // 轉為編輯按鈕
                            trz.find('.card-footer .setupBlock').removeClass('active').html('').append(`
                                <a class="btn btn-warning btnEditPri" href="#"><i class="far fa-edit"></i> 編輯</a>
                            `);
                            // 權限欄位的禁用、啟用
                            trz.find('.inputStatus').prop('disabled', true);
                        }
                    });
                };
            });
            // 分類狀態控制
            $(document).on('change', '.edit_status', function () {
                if ($(this).prop('checked') == true) {
                    $(this).val("1");
                } else {
                    $(this).val("0");
                }
            });
        } else {
            fails();
        };
    }, rej => {
        fails();
    });
});
