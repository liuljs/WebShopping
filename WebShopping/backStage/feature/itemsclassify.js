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
// 驗證
function dataUpdateCheck(aId, name) {
    if (aId.trim() === '') {
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    }
    if (name.val().trim() === '' || name.val().length > 20) {
        name.focus();
        return check = false, errorText = '請確認分類名稱是否確實填寫、長度不得超過20字元！';
    }
    else {
        return check = true, errorText = "";
    }
};
$().ready(function () {
    //
    // 顯示新增、編輯功能
    if (menuAuth[authParent.indexOf("PM")].ACT_EDT == "Y") {
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
            dataUpdateCheck(idz, add_priName);
            if (check == true) {
                let dataObj = {
                    "name": add_priName.val()
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
                    xhr.open('POST', `${URL}CategoryAdmin`, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send($.param(dataObj));
                }
            } else {
                alert(errorText);
            }
        });
    };
    //
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                let callBackData = JSON.parse(xhr.responseText);
                html = "";
                for (let i = 0; i < callBackData.length; i++) {
                    for (let j = 0; j < callBackData[i].SubCategories.length; j++) {
                        secs += `
                            <tr data-num="${callBackData[i].SubCategories[j].Id}">
                                <td data-title="名稱" class="cls_name">
                                    <div class="input-group">
                                        <input type="text" class="form-control inputStatus edit_secName" value="${callBackData[i].SubCategories[j].Name}" disabled>
                                        <input type="hidden" class="edit_minCls" value='${JSON.stringify(callBackData[i].SubCategories[j].SubCategories)}'>
                                    </div>
                                </td>
                                <td data-title="狀態" class="cls_status" data-num="${i}">
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input inputStatus edit_status edit_secStatus" id="${callBackData[i].SubCategories[j].Id}secSwitch${i}" value="${callBackData[i].SubCategories[j].Enable}" disabled>
                                        <label class="custom-control-label" for="${callBackData[i].SubCategories[j].Id}secSwitch${i}">開啟</label>
                                    </div>
                                </td>
                                <td data-title="設定" class="cls_set">
                                    <div class="setupBlock">
                                        <button class="btn btn-secondary btn-sm mb-1 btnMore" data-toggle="modal" data-target="#classifyMore">更多</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    };
                    html += `
                        <div data-num="${callBackData[i].Id}" class="card">
                            <div class="card-header">
                                <h3 class="text-primary d-inline">主分類 0${i + 1}</h3>
                                <div class="d-flex flex-wrap my-2">
                                    <div class="form-group d-flex align-items-center pl-0 col-md-8">
                                        <label class="mr-2">主分類名稱<span class="markz"></span></label>
                                        <div class="input-group">
                                            <input type="text" class="form-control inputStatus edit_priName" value="${callBackData[i].Name}" disabled>
                                        </div>
                                    </div>
                                    <div class="form-group d-flex align-items-center justify-content-end py-1 pr-0 col-md-4">
                                        <label class="mr-4">狀態</label>
                                        <div class="custom-control custom-switch">
                                            <input type="checkbox" id="primSwitch${i}" class="custom-control-input inputStatus edit_status edit_priStatus" value="${callBackData[i].Enable}" disabled>
                                            <label class="custom-control-label" for="primSwitch${i}">開啟</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="expansions mx-0">
                                    <div class="btnExps"><i class="fas fa-chevron-up"></i></div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="table-wrap classifies mb-4">
                                    <table>
                                        <thead>
                                            <tr>
                                                <td>次分類名稱<span class="notes">（請至少設定一個次分類）</span></td>
                                                <td width="20%">狀態</td>
                                                <td width="20%">設定</td>
                                            </tr>
                                        </thead>
                                        <tbody class="cls">
                        `
                        +
                        secs
                        +
                        `
                                        </tbody>
                                        <tfoot class="clsSet">
                                            <tr></tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div class="card-footer">
                                <div class="setupBlock justify-content-end"></div>
                            </div>
                        </div>
                    `;
                    secs = "";
                };
                primaries.html(html);
            } else {
                html = "";
                primaries.html(html);
            };
            // 展開收縮功能
            let btnExps = $('.btnExps');
            btnExps.on('click', function () {
                $(this).toggleClass('active');
                $(this).parents('.card ').find('.card-body').slideToggle('normal');
            });
            btnExps.eq(0).addClass('active');
            btnExps.eq(0).parents('.card ').find('.card-body').slideDown(0);
            // 主分類、次分類狀態顯示
            let chk = $('.edit_status');
            for (let i = 0; i < chk.length; i++) {
                if (chk.eq(i).val() == "1") {
                    chk.eq(i).prop('checked', true);
                } else {
                    chk.eq(i).prop('checked', false);
                };
            };
            // 顯示編輯功能
            if (menuAuth[authParent.indexOf("PM")].ACT_EDT == "Y") {
                clsContents.find('.card .card-footer .setupBlock').append(`
                    <a class="btn btn-warning btnEditPri" href="#"><i class="far fa-edit"></i> 編輯</a>
                `);
                edits.find('.modal-footer .setupBlock').append(`
                    <a class="btn btn-warning btnEditSec" href="#"><i class="far fa-edit"></i> 編輯</a>
                `);
                // Edit Primary
                $(document).on('click', '.btnEditPri', function (e) {
                    e.preventDefault(), e.stopPropagation(); //
                    let trz = $(this).parents('.card');
                    let id = trz.data('num');
                    if ($('.card-footer .setupBlock').hasClass('active')) {
                        alert('請確認是否有其他主分類尚未儲存！');
                    }
                    else {
                        // 點擊編輯做展開的動作
                        if (!trz.find('.btnExps').hasClass('active')) {
                            trz.find('.card-body').slideDown(500);
                            trz.find('.btnExps').addClass('active');
                        };
                        // 原資料
                        let orgPrimName = trz.find('.edit_priName').val(), orgPrimStatus = trz.find('.edit_priStatus').val();
                        let orgSecArr = new Array();
                        for (let i = 0; i < trz.find('.cls tr').length; i++) {
                            let dataObj = {
                                "secName": trz.find('.cls tr').eq(i).find('.edit_secName').val(),
                                "secStatus": trz.find('.cls tr').eq(i).find('.edit_secStatus').val()
                            }
                            orgSecArr.push(dataObj);
                        };
                        // 顯示主分類刪除功能
                        if (menuAuth[authParent.indexOf("PM")].ACT_DEL == "Y") {
                            trz.find('.card-footer .setupBlock').addClass('active').html('').append(`
                                <a class="btn btn-success btnSavePri" href="#"><i class="far fa-edit"></i> 儲存</a>
                                <a class="btn btn-danger btnDelPri" href="#"><i class="fas fa-trash"></i> 刪除</a>
                                <a class="btn btnCancel  ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                            `);
                            // Delete
                            $('.btnDelPri').on('click', function (e) {
                                e.preventDefault(); // 取消 a 預設事件
                                let num = $(this).parents('.card').data('num');
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
                                    xhr.open('DELETE', `${URL}CategoryAdmin/${num}`, true)
                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    xhr.send($.param(dataObj));
                                };
                            });
                        }
                        else {
                            trz.find('.card-footer .setupBlock').addClass('active').html('').append(`
                                <a class="btn btn-success btnSavePri" href="#"><i class="far fa-edit"></i> 儲存</a>
                                <a class="btn btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                            `);
                        };
                        // 權限欄位的禁用、啟用
                        trz.find('.inputStatus').prop('disabled', false);
                        // 移除已存在次分類的更多按鈕：編輯主分類、次分類時不能增加、編輯子分類
                        trz.find('.cls_set .setupBlock').html(`
                            <span> - </span>
                        `);
                        // 顯示增加次分類的按鈕
                        trz.find('.clsSet tr').html('').append(`
                            <td colspan="3" class="text-right" data-title="設定">
                                <button class="btn btn-info btn-sm btnAddSec"><i class="fas fa-plus"></i> 增加次分類</button>
                            </td>
                        `);
                        // 增加次分類
                        $('.btnAddSec').on('click', function (e) {
                            e.preventDefault(), e.stopPropagation();
                            let trz = $(this).parents('.classifies');
                            x = trz.find('.cls tr:last-child').find('.cls_status').data('num');
                            x++;
                            if (trz.find('.cls tr').length < sec_max) {
                                trz.find('.cls').append(`
                                    <tr class="addField">
                                        <td class="cls_name" data-title="名稱">
                                            <div class="input-group">
                                                <input type="text" class="form-control inputStatus edit_secName" placeholder="">
                                            </div> 
                                        </td>
                                        <td class="cls_status" data-title="狀態" data-num="${x}">
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input edit_status inputStatus edit_secStatus" id="${id}secSwitch${x}" value="0">
                                                <label class="custom-control-label" for="${id}secSwitch${x}">開啟</label>
                                            </div>
                                        </td>
                                        <td class="cls_set" data-title="設定">
                                            <div class="setupBlock">
                                                <a class="btn btn-light btn-sm mb-1 btnDelField" href="#"><i class="fas fa-trash"></i> 移除</a>
                                            </div>
                                        </td>
                                    </tr>
                                `);
                            };
                        });
                        // Save Primary
                        $('.btnSavePri').on('click', function (e) {
                            e.preventDefault();
                            let trz = $(this).parents('.card');
                            dataUpdateCheck(idz, trz.find('.edit_priName'));
                            if (check == true) {
                                // 將次分類合成一個陣列
                                let clsSecArr = new Array();
                                for (let i = 0; i < trz.find('.cls tr').length; i++) {
                                    // 如果是新增的次分類
                                    if (trz.find('.cls tr').eq(i).hasClass('addField')) {
                                        editaction = 1;
                                        addClsId = 1
                                    } else {
                                        editaction = 0;
                                        addClsId = trz.find('.cls tr').eq(i).data('num');
                                    };
                                    dataUpdateCheck(idz, trz.find('.cls tr').eq(i).find('.edit_secName'));
                                    if (check == true) {
                                        let dataObj = {
                                            "id": addClsId,
                                            "name": trz.find('.cls tr').eq(i).find('.edit_secName').val().trim(),
                                            "enable": trz.find('.cls tr').eq(i).find('.edit_secStatus').val().trim(),
                                            "editaction": editaction
                                        };
                                        clsSecArr.push(dataObj);
                                    } else {
                                        break;
                                    }
                                };
                                if (check == true) {
                                    let dataObj = {
                                        "id": trz.data('num'),
                                        "name": trz.find('.edit_priName').val().trim(),
                                        "enable": trz.find('.edit_priStatus').val().trim(),
                                        "subCategories": clsSecArr,
                                    };
                                    if (confirm("您確定要儲存這筆主分類的修改嗎？")) {
                                        let xhr = new XMLHttpRequest();
                                        xhr.onload = function () {
                                            if (xhr.status == 200 || xhr.status == 204) {
                                                alert("儲存修改成功！");
                                                location.reload();
                                            } else {
                                                alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                            };
                                        };
                                        xhr.open('POST', `${URL}CategoryAdmin/EditFirstCategory`, true);
                                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                        xhr.send($.param(dataObj));
                                    }
                                } else {
                                    alert(errorText);
                                };
                            } else {
                                alert(errorText);
                            };
                        });
                        // Cancel
                        trz.find('.btnCancel').on('click', function (e) {
                            e.preventDefault();
                            let trz = $(this).parents('.card');
                            if (confirm("尚未儲存更改的內容，確定要取消嗎？")) {
                                // 還原 Slide 的狀態
                                // if (trz.find('.btnExps').hasClass('active')) {
                                //     trz.find('.card-body').slideUp(500);
                                //     trz.find('.btnExps').removeClass('active');
                                // };
                                // 移除尚未儲存的次分類
                                trz.find('.cls tr.addField').remove();
                                // 還原欄位原本資料
                                trz.find('.edit_priName').val(orgPrimName), trz.find('.edit_priStatus').val(orgPrimStatus);
                                if (trz.find('.edit_priStatus').val() == "1") {
                                    trz.find('.edit_priStatus').prop('checked', true);
                                } else {
                                    trz.find('.edit_priStatus').prop('checked', false);
                                };
                                for (let i = 0; i < trz.find('.cls tr').length; i++) {
                                    trz.find('.cls tr').eq(i).find('.edit_secName').val(orgSecArr[i].secName);
                                    trz.find('.cls tr').eq(i).find('.edit_secStatus').val(orgSecArr[i].secStatus);
                                    if (trz.find('.cls tr').eq(i).find('.edit_secStatus').val() == "1") {
                                        trz.find('.cls tr').eq(i).find('.edit_secStatus').prop('checked', true);
                                    } else {
                                        trz.find('.cls tr').eq(i).find('.edit_secStatus').prop('checked', false);
                                    };
                                };
                                // 移除增加次分類按鈕
                                trz.find('.clsSet tr').html('');
                                // 將更多按鈕加回已存在的次分類欄位
                                trz.find('.cls .cls_set .setupBlock').html('').append(`
                                    <button class="btn btn-secondary btn-sm mb-1 btnMore" data-toggle="modal" data-target="#classifyMore">更多</button>
                                `);
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
                // Edit Secondary
                $(document).on('click', '.btnEditSec', function (e) {
                    e.preventDefault(), e.stopPropagation();
                    let trz = $(this).parents('.edits');
                    let id = trz.find('.modal-title').data('num');
                    // 顯示次分類刪除功能
                    if (menuAuth[authParent.indexOf("PM")].ACT_DEL == "Y") {
                        trz.find('.modal-footer .setupBlock').html('').append(`
                            <a class="btn btn-success btnSaveSec" href="#"><i class="far fa-edit"></i> 儲存</a>
                            <a class="btn btn-danger btnDelSec" href="#"><i class="fas fa-trash"></i> 刪除</a>
                            <a class="btn btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                        `);
                        // Delete
                        $('.btnDelSec').on('click', function (e) {
                            e.preventDefault(); // 取消 a 預設事件
                            let trz = $(this).parents('.edits');
                            let limit = trz.find('.cls').data('qty');
                            if (limit > 1) {
                                let num = trz.find('.modal-title').data('num');
                                let dataObj = {
                                    "id": num
                                };
                                if (confirm("您確定要刪除這筆次分類嗎？")) {
                                    let xhr = new XMLHttpRequest();
                                    xhr.onload = function () {
                                        if (xhr.status == 200 || xhr.status == 204) {
                                            location.reload();
                                        } else {
                                            alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                        };
                                    };
                                    xhr.open('DELETE', `${URL}CategoryAdmin/DeleteSubCategory/${num}`, true)
                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    xhr.send($.param(dataObj));
                                };
                            } else {
                                alert('至少要留一筆次分類！');
                            }
                        });
                    }
                    else {
                        trz.find('.modal-footer .setupBlock').html('').append(`
                            <a class="btn btn-success btnSaveSec" href="#"><i class="far fa-edit"></i> 儲存</a>
                            <a class="btn btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                        `);
                    };
                    // 原資料
                    let orgMinArr = new Array();
                    for (let i = 0; i < trz.find('.cls tr').length; i++) {
                        let dataObj = {
                            "Id": trz.find('.cls tr').eq(i).data('num'),
                            "minName": trz.find('.cls tr').eq(i).find('.edit_minName').val(),
                            "minStatus": trz.find('.cls tr').eq(i).find('.edit_minStatus').val()
                        }
                        orgMinArr.push(dataObj);
                    };
                    // 清除預設
                    if (trz.find('.cls tr').hasClass('none')) {
                        trz.find('.cls').html('')
                    };
                    // 權限欄位的禁用、啟用
                    trz.find('.inputStatus').prop('disabled', false);
                    // 顯示子分類移除按鈕
                    trz.find('.modal-body .setupBlock').html('').append(`
                            <a class="btn btn-danger btn-sm btnDelField delMin" href="#"><i class="fas fa-trash"></i> 刪除</a>
                        `);
                    // 顯示增加子分類的按鈕
                    trz.find('.clsSet tr').append(`
                        <td colspan="3" class="text-right" data-title="設定">
                            <button class="btn btn-info btn-sm btnAddMin"><i class="fas fa-plus"></i> 增加子分類</button>
                        </td>
                    `);
                    // 增加子分類
                    $('.btnAddMin').on('click', function (e) {
                        e.preventDefault();
                        let trz = $(this).parents('.classifies');
                        if (trz.find('.cls tr').length < sec_max) {
                            if (trz.find('.cls tr:last-child').find('.cls_status').data('num') !== undefined) {
                                x = trz.find('.cls tr:last-child').find('.cls_status').data('num');
                            } else {
                                x = 0
                            }
                            x++;
                            trz.find('.cls').append(`
                                <tr class="addField">
                                    <td class="cls_name" data-title="名稱">
                                        <div class="input-group">
                                            <input type="text" class="form-control inputStatus edit_minName">
                                        </div> 
                                    </td>
                                    <td class="cls_status" data-title="狀態" data-num="${x}">
                                        <div class="custom-control custom-switch">
                                            <input type="checkbox" class="custom-control-input edit_status inputStatus edit_minStatus" id="${id}minSwitch${x}" value="0">
                                            <label class="custom-control-label" for="${id}minSwitch${x}">開啟</label>
                                        </div>
                                    </td>
                                    <td class="cls_set" data-title="設定">
                                        <div class="setupBlock">
                                            <a class="btn btn-danger btn-sm btnDelField delMin" href="#"><i class="fas fa-trash"></i> 刪除</a>
                                        </div>
                                    </td>
                                </tr>
                            `);
                        }
                    });
                    // Save Secondary
                    $('.btnSaveSec').on('click', function (e) {
                        e.preventDefault();
                        let trz = $(this).parents('.edits');
                        let id = trz.find('.modal-title').data('num');
                        // 已有的子分類
                        if (trz.find('.cls tr:not(".addField")').length > 0) {
                            clsMinArr = [];
                            for (let i = 0; i < trz.find('.cls tr:not(".addField")').length; i++) {
                                let dataObj = {
                                    "id": trz.find('.cls tr:not(".addField")').eq(i).data('num'),
                                    "name": trz.find('.cls tr:not(".addField")').eq(i).find('.edit_minName').val(),
                                    "enable": trz.find('.cls tr:not(".addField")').eq(i).find('.edit_minStatus').val(),
                                    "editaction": 0
                                };
                                clsMinArr.push(dataObj);
                            };
                        };
                        // 新增的子分類
                        if (trz.find('.cls .addField').length > 0) {
                            clsAddArr = [];
                            for (let i = 0; i < trz.find('.cls .addField').length; i++) {
                                let dataObj = {
                                    "id": 1,
                                    "name": trz.find('.cls .addField').eq(i).find('.edit_minName').val(),
                                    "enable": trz.find('.cls .addField').eq(i).find('.edit_minStatus').val(),
                                    "editaction": 1
                                }
                                clsAddArr.push(dataObj);
                            };
                        };
                        // 驗證各個子分類
                        for (let i = 0; i < trz.find('.cls tr').length; i++) {
                            dataUpdateCheck(idz, trz.find('.cls tr').eq(i).find('.edit_minName'));
                            if (check == false) {
                                break;
                            };
                        };
                        if (check == true) {
                            let dataObj = {
                                "id": id,
                                "name": trz.find('.modal-title').data('name'),
                                "subCategories": clsMinArr.concat(clsAddArr, clsDelArr),
                            };
                            if (confirm("您確定要儲存這筆次分類的修改嗎？")) {
                                let xhr = new XMLHttpRequest();
                                xhr.onload = function () {
                                    if (xhr.status == 200 || xhr.status == 204) {
                                        alert("儲存修改成功！");
                                        location.reload();
                                    } else {
                                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                                    };
                                };
                                xhr.open('POST', `${URL}CategoryAdmin/EditSecondCategory`, true);
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.send($.param(dataObj));
                            };
                        } else {
                            alert(errorText);
                        };
                    });
                    // Cancel
                    trz.find('.btnCancel').on('click', function (e) {
                        e.preventDefault(), e.stopPropagation();
                        let trz = $(this).parents('.edits');
                        if (confirm("尚未儲存更改的內容，確定要取消嗎？")) {
                            // 移除尚未存入的次分類
                            trz.find('.cls tr.addField').remove();
                            // 還原欄位原本資料
                            trz.find('.cls').html('');
                            for (let i = 0; i < orgMinArr.length; i++) {
                                trz.find('.cls').append(`
                                    <tr data-num="${orgMinArr[i].Id}">
                                        <td class="cls_name" data-title="名稱">
                                            <div class="input-group">
                                                <input type="text" class="form-control inputStatus edit_minName" value=${orgMinArr[i].minName}>
                                            </div> 
                                        </td>
                                        <td class="cls_status" data-title="狀態" data-num="${i}">
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input edit_status inputStatus edit_minStatus" id="${i}minSwitch${i}" value="${orgMinArr[i].minStatus}">
                                                <label class="custom-control-label" for="${i}minSwitch${i}">開啟</label>
                                            </div>
                                        </td>
                                        <td class="cls_set" data-title="設定">
                                            <div class="setupBlock">
                                                <a class="btn btn-danger btn-sm btnDelField delMin" href="#"><i class="fas fa-trash"></i> 刪除</a>
                                            </div>
                                        </td>
                                    </tr>
                                `);
                                if (trz.find('.cls tr').eq(i).find('.edit_minStatus').val() == "1") {
                                    trz.find('.cls tr').eq(i).find('.edit_minStatus').prop('checked', true);
                                } else {
                                    trz.find('.cls tr').eq(i).find('.edit_minStatus').prop('checked', false);
                                };
                            }
                            // 移除增加次分類按鈕
                            trz.find('.clsSet tr').html('');
                            // 將更多按鈕加回已存在的次分類欄位
                            trz.find('.cls .cls_set .setupBlock').html('').append(`
                                <span> - </span>
                            `);
                            // 轉為編輯按鈕
                            trz.find('.modal-footer .setupBlock').html('').append(`
                                <a class="btn btn-warning btnEditSec" href="#"><i class="far fa-edit"></i> 編輯</a>
                            `);
                            // 權限欄位的禁用、啟用
                            trz.find('.inputStatus').prop('disabled', true);
                            // Close
                            trz.find('.close').unbind('click').on('click', function (e) {
                                e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件、取消 a 預設事件
                                let trz = $(this).parents('.modal-content');
                                trz.find('.closez').trigger('click');
                            });
                        };
                    });
                    // Close
                    trz.find('.close').unbind('click').on('click', function (e) {
                        e.preventDefault(); // 取消 a 預設事件
                        e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                        let trz = $(this).parents('.modal-content');
                        if (confirm("尚未儲存更改的內容，確定要關閉嗎？")) {
                            // 移除尚未存入的次分類
                            trz.find('.cls tr.addField').remove();
                            // 移除增加次分類按鈕
                            trz.find('.clsSet tr').html('');
                            // 將更多按鈕加回已存在的次分類欄位
                            trz.find('.cls .cls_set .setupBlock').html('').append(`
                                <span> - </span>
                            `);
                            // 轉為編輯按鈕
                            trz.find('.modal-footer .setupBlock').html('').append(`
                                <a class="btn btn-warning btnEditSec" href="#"><i class="far fa-edit"></i> 編輯</a>
                            `);
                            // 權限欄位的禁用、啟用
                            trz.find('.inputStatus').prop('disabled', true);
                            trz.find('.closez').trigger('click');
                        };
                    });
                });
                // 移除新增次分類、子分類的欄位
                $(document).on('click', '.btnDelField', function (e) {
                    e.preventDefault();
                    // 如果是子分類刪除
                    if ($(this).hasClass('delMin')) {
                        if (!$(this).parents('tr').hasClass('addField')) {
                            let dataObj = {
                                "id": $(this).parents('tr').data('num'),
                                "name": $(this).parents('tr').find('.edit_minName').val(),
                                "enable": $(this).parents('tr').find('.edit_minStatus').val(),
                                "editaction": 2
                            };
                            clsDelArr.push(dataObj);
                        }
                        $(this).parents('tr').remove();
                    } else {
                        $(this).parents('tr').remove();
                    }
                });
            };
            // More
            $(document).on('click', '.btnMore', function () {
                let clsQty = $(this).parents('.cls').find('tr').length;
                let trz = $(this).parents('tr');
                let minCls = trz.find('.edit_minCls').val();
                mins = "", html = "";
                if (minCls !== "") {
                    let callBackData = JSON.parse(minCls);
                    for (let i = 0; i < callBackData.length; i++) {
                        mins += `
                            <tr data-num="${callBackData[i].Id}">
                                <td class="cls_name" data-title="名稱">
                                    <div class="input-group">
                                        <input type="text" class="form-control inputStatus edit_minName" value="${callBackData[i].Name}" disabled>
                                    </div>
                                </td>
                                <td class="cls_status" data-title="狀態" data-num="1">
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input inputStatus edit_status edit_minStatus" id="${callBackData[i].Id}minSwitch${i}" value="${callBackData[i].Enable}" disabled>
                                        <label class="custom-control-label" for="${callBackData[i].Id}minSwitch${i}">開啟</label>
                                    </div>
                                </td>
                                <td class="cls_set" data-title="設定">
                                    <div class="setupBlock">
                                        <span> - </span>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }
                } else {
                    mins = `
                        <tr class="none">
                            <td colspan="2"><span> - </span><td>
                        </tr>
                    `;
                };
                html = `
                    <div class="modal-header">
                        <h3 class="modal-title d-flex" data-num="${trz.data('num')}" data-name="${trz.find('.edit_secName').val()}">
                            <span>次分類</span>
                            <span class="number-set text-primary">${trz.find('.edit_secName').val()}</span>
                            <span class="ml-1"> - 新增子分類</span>
                        </h3>
                        <button type="button" class="close"><span>&times;</span></button>
                        <input type="hidden" class="closez" data-dismiss="modal" aria-label="Close" aria-hidden="true">
                    </div>
                    <div class="modal-body">
                        <div class="table-wrap classifies">
                            <table>
                                <thead>
                                    <tr>
                                        <td>子分類名稱<span class="notes">（如有增加子分類，名稱為必填欄位）</span></td>
                                        <td width="20%">狀態</td>
                                        <td width="20%">設定</td>
                                    </tr>
                                </thead>
                                <tbody class="cls minors" data-qty="${clsQty}">
                    `+
                    mins
                    + `
                                </tbody>
                                <tfoot class="clsSet">
                                    <tr></tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                `;
                edits_content.html(html);
                // 將目前的子分類合成一個陣列
                clsMinArr = [];
                if (edits_content.find('.cls tr').length > 0) {
                    for (let i = 0; i < edits_content.find('.cls tr').length; i++) {
                        let dataObj = {
                            "id": edits_content.find('.cls tr').eq(i).data('num'),
                            "name": edits_content.find('.cls tr').eq(i).find('.edit_minName').val(),
                            "enable": edits_content.find('.cls tr').eq(i).find('.edit_minStatus').val(),
                            "editaction": 0
                        }
                        clsMinArr.push(dataObj);
                    };
                };
                // 分類狀態顯示
                let chk = $('.edit_status');
                for (let i = 0; i < chk.length; i++) {
                    if (chk.eq(i).val() == "1") {
                        chk.eq(i).prop('checked', true);
                    } else {
                        chk.eq(i).prop('checked', false);
                    };
                };
                // Close
                edits_content.find('.close').unbind('click').on('click', function (e) {
                    e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件、取消 a 預設事件
                    let trz = $(this).parents('.modal-content');

                    // 移除尚未存入的次分類
                    trz.find('.cls tr.addField').remove();
                    // 移除增加次分類按鈕
                    trz.find('.clsSet tr').html('');
                    // 將更多按鈕加回已存在的次分類欄位
                    trz.find('.cls .cls_set .setupBlock').html('').append(`
                        <span> - </span>
                    `);
                    // 轉為編輯按鈕
                    trz.find('.modal-footer .setupBlock').html('').append(`
                        <a class="btn btn-warning btnEditSec" href="#"><i class="far fa-edit"></i> 編輯</a>
                    `);
                    // 權限欄位的禁用、啟用
                    trz.find('.inputStatus').prop('disabled', true);

                    trz.find('.closez').trigger('click');
                });

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
            // alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
            getLogout();
        };
    };
    xhr.open('GET', `${URL}CategoryAdmin `, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);
});

