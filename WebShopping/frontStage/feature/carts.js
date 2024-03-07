// CARTS
let cartz = $('.cartz'), lists = $('.lists');
let cartQty = $('.cartQty'), cartSubAmts = $('.cartSubAmts'), cartAmts = $('.cartAmts');
let minVal = 1, maxVal;
function qtyControls(num, newVal, qty, subTotals, qtyTotals, amtTotals, odrTotals) {
    let dataObj = {
        "id": num,
        "quantity": newVal
    };
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200 || xhr.status == 204) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200) {
                    if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                        let callBackData = JSON.parse(xhr.responseText);
                        amt = "";
                        // 商品總額
                        if (callBackData.Discount_Total !== "" && callBackData.Discount_Total !== 0 && callBackData.Discount_Total !== null && callBackData.Discount_Total !== undefined) {
                            amt = callBackData.Discount_Total;
                        } else {
                            amt = callBackData.Total;
                        };

                        let item = $.map(callBackData.Items, function (item, index) {
                            if (num == item.id) {
                                return item;
                            }
                        });
                        qty.val(newVal), subTotals.html(thousands(item[0].amount)), qtyTotals.html(callBackData.Count), amtTotals.html(thousands(amt)), odrTotals.html(thousands(amt));
                    };
                };
            };
            xhr.open('GET', `${URL}Orders/GetCart`, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(null);
        } else {
            // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            getLogout();
        };
    };
    xhr.open('PUT', `${URL}Orders/UpdateCart`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send($.param(dataObj));
};
// NOTFOUND
function fails() {
    html = `
        <div class="no_result">
            <i class="bi bi-clipboard-x"></i>
            <p>購物車尚未有任何商品</p>
            <P>快去逛逛吧!</P>
            <a class="more" href="./products_list.html">繼續選購</a>
        </div>
    `;
    cartz.html('').html(html);
};
$().ready(function () {
    // CARTS
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `Orders/GetCart`,
        "QUERYs": "",
        "Sends": "",
        "Counts": "",
    };
    getPageDatas(dataObj).then(res => {
        if (res !== null) {
            // CART LIST
            html = "";
            for (let i = 0; i < res.Items.length; i++) {
                html += `
                    <tr data-num="${res.Items[i].id}" data-qty="${res.Items[i].stock_qty}">
                        <td>
                            <div class="cart_item">
                                <a href="./product_detail.html?pdtId=${res.Items[i].spu_id}" class="cart_link">
                                    <div class="images">
                                        <img src="${IMGURL}/products/${res.Items[i].spu_id}/${res.Items[i].product_cover}" alt="">
                                    </div>
                                    <div class="main">
                                        <p class="title">${res.Items[i].spu}</p>
                                    </div>
                                </a>
                            </div>
                        </td>
                        <td>
                            <span class="cart_price" data-title="單價">
                                ${thousands(res.Items[i].price)}
                            </span>
                        </td>
                        <td>
                            <div class="add qty" data-title="數量">
                                <div data-num="minus" class="minus qty-minus">-</div>
                                <input type="text" class="edit_qty numberz" value="${res.Items[i].quantity}">
                                <div data-num="plus" class="plus qty-plus">+</div>
                            </div>
                        </td>
                        <td>
                            <span class="sub_total subs" data-title="小計">${thousands(res.Items[i].amount)}</span>
                        </td>
                        <td>
                            <a href="" class="btn_remove btnRemove" data-title="功能">
                                <i class="bi bi-trash"></i>移除</a>
                        </td>
                    </tr>
                `;
            };
            lists.html(html);
            // CART TOTALS
            cartQty.html(res.Count);
            cartSubAmts.html(thousands(res.Total));
            cartAmts.html(thousands(res.Total));
            // 數量增減
            $('.qty').find('input').on('change', function () {
                let trz = $(this);
                let num = trz.parents('tr').data('num'), newVal;
                // 最大數量
                maxVal = trz.parents('tr').data('qty');
                if (trz.val() == "" || trz.val() == 0) {
                    trz.val(minVal);
                    newVal = minVal;
                } else if (trz.val() > maxVal) {
                    alert(`不好意思，目前此商品的最大購買數量為 ${maxVal} 件。`);
                    trz.val(maxVal);
                    newVal = maxVal;
                } else {
                    newVal = trz.val();
                };
                qtyControls(num, newVal, trz.parents('.qty').find('input'), trz.parents('tr').find('.subs'), cartQty, cartSubAmts, cartAmts);
            });
            // 數量控制項
            $('.qty').find('div').on('click', function () {
                let trz = $(this).parents('tr');
                let num = trz.data('num');
                let val = trz.find('.edit_qty'), newVal;
                // 最大數量
                maxVal = trz.data('qty');
                if ($(this).data('num') == "minus") {
                    if (val.val() > minVal) {
                        newVal = parseFloat(val.val()) - 1;
                        qtyControls(num, newVal, val, trz.find('.subs'), cartQty, cartSubAmts, cartAmts);
                    } else {
                        newVal = minVal;
                    };
                } else {
                    if (val.val() < maxVal) {
                        newVal = parseFloat(val.val()) + 1;
                        qtyControls(num, newVal, val, trz.find('.subs'), cartQty, cartSubAmts, cartAmts);
                    } else {
                        newVal = maxVal;
                        alert(`不好意思，目前此商品的最大購買數量為 ${maxVal} 件。`)
                    };
                };
            });
            // 移除購物車商品
            $('.btnRemove').on('click', function (e) {
                e.preventDefault();
                let num = $(this).parents('tr').data('num');
                if (confirm("您確定要移除這件商品嗎？")) {
                    let dataObj = {
                        "id": num
                    };
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status == 200) {
                            alert("移除商品成功！");
                            location.reload();
                        };
                    };
                    xhr.open('DELETE', `${URL}Orders/DeleteCart`, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
                    xhr.send($.param(dataObj));
                }
            });
            // Next Part
            $('.btnNextPart').on('click', function (e) {
                e.preventDefault();
                if (Number(res.Count) > 0) {
                    if (Number(res.Total) < 100) {
                        alert("訂單成立金額需滿 100 元！")
                    } else {
                        location.href = "./consignee.html";
                    };
                } else {
                    alert('目前購物車中沒有加入任何商品哦！');
                }
            });
        } else {
            fails();
        };
    }, rej => {
        if (rej == "NOTFOUND") {
            // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            getLogout();
        };
    });
});