// Javascript for the Cart page
jQuery(document).ready(function () {

    jQuery('div.quantity input.quantity').keypress(function (evt) {
        return isNumberKey(evt);
    });

    jQuery('a.emptyCartButton').click(function () {
        return Cart.ClearCart();
    });

    // set up removal of couponcode cookie when adding a new coupon
    jQuery('form#cartCouponForm').submit(function () {
        // remove cookie by setting expiry to -1 days
        createCookie('couponcode', '', -1);
    });

    jQuery('form#cartCouponForm').submit(function () {
        if (jQuery("input#codeEntered").val() == "") {
            changeAlert("You need to enter a coupon code before you can apply it.", "error", "#ui-alert-message");
            return false;
        }
    });
    jQuery('div.orderSummaryContainer div.row .cartUpdateQty').click(function (e) {
        clearErrors();
        qty = jQuery(this).parent().parent().find("input.quantity").attr("value");
        itemid = jQuery(this).parent().parent().find("input.cartProductID").attr("value");
        orderItemId = jQuery(this).parent().parent().find("input.cartOrderItemID").attr("value");

        CartCheckInventoryTCS(itemid, qty, orderItemId);
    });

});

var Cart = function () {
    this.Initialize();
}

var CartThis = null;

jQuery.extend(Cart.prototype, {

    Initialize: function () {

        CartThis = this;

    },

    UpdateItem: function (orderitemid, itemid, qty) {
        /// <summary>
        ///     Updates an order item to the selected item ID or quantity.
        /// </summary>
        /// <param name="orderitemid" type="Number">
        ///     The unique identifier of this order item.
        /// </param>
        /// <param name="itemid" type="Number">
        ///     The item ID to change this order item to.
        ///     (i.e. to change a size, the item ID of the new size)
        /// </param>
        /// <param name="qty" type="String">
        ///     The quantity to update this order item to.
        ///     If 0 or blank, item will be removed.
        /// </param>

        qty = qty * 1;

        if (qty > 0) {
            this.CheckInventory(orderitemid, itemid, qty);
        }
        else {
            this.RemoveItem(orderitemid);
        }

    },

    RemoveItem: function (orderitemid) {
        /// <summary>
        ///     Removes an order item with the given ID.
        /// </summary>
        /// <param name="orderitemid" type="Number">
        ///     The unique identifier of this order item.
        /// </param>

        window.location.href = "/cart/delete/item/" + orderitemid;

    },

    ClearCart: function () {
        /// <summary>
        ///     Removes all items from the cart.
        /// </summary>

        var ret = confirm('Please confirm that you wish to empty your shopping cart.');

        if (ret) {
            var requestVerificationToken = jQuery("#emptyCartForm > input[name='__RequestVerificationToken']").val();

            jQuery.ajax({
                type: "POST",
                url: "/cart/clear",
                data: {
                    __RequestVerificationToken: requestVerificationToken
                },
                success: function (data) {
                    window.location.href = "/cart/view";
                },
                error: function () {
                    var errorMessage = "We're sorry, but there was an error connecting to the server. Please try again.";
                    alert(errorMessage);
                }
            });
        }

        return false;

    },

    CheckInventory: function (orderitemid, itemid, qty) {
        /// <summary>
        ///     Checks the inventory of the given item ID to see if it has enough on hand
        ///     to allow the user to order the given quantity.
        /// </summary>
        /// <param name="orderitemid" type="Number">
        ///     The unique identifier of this order item.
        /// </param>
        /// <param name="itemid" type="Number">
        ///     The item ID to use to check inventory.
        /// </param>
        /// <param name="qty" type="String">
        ///     The quantity the user is requesting.
        /// </param>

        var checkInventoryURL = '/cart/checkinventory?itemid=' + itemid + '&qty=' + qty + '&orderItemID=' + orderitemid + '&';

        jQuery.ajax({
            type: "GET",
            url: checkInventoryURL,
            data: "r=" + (Math.random() * 10000),
            success: function (data) {
                CartThis.RefreshQty(data, orderitemid, itemid, qty);
            },
            error: function () {
                // Stuff broke. 
                var errorMessage = "We're sorry, but there was an error connecting to the server. Please try again after the page reloads.";
                alert(errorMessage);

                window.location.href = "/cart/view";
            }
        });

    },

    RefreshQty: function (data, orderitemid, itemid, qty) {
        if (data === undefined)
            return;

        if (data.Error) {
            var errorMessage = "We're sorry, but there was an error connecting to the server. Please try again after the page reloads.";
            alert(errorMessage);
            window.location.href = "/cart/view";
        }

        var qtyAvailable = data.QtyAvailable;

        if (qty > qtyAvailable) {
            changeAlert("Sorry, the quantity requested is not available. Please click Update to add the updated quantity of " + qtyAvailable, "error", "#ui-cartitem" + itemid + "-message");
            jQuery("#ui-cartitem" + itemid + "-message").parent().find("input.quantity").attr("value", qtyAvailable);
            jQuery("#ui-cartitem" + itemid + "-message").parent().find("select.ddlProductOptionItem option").removeAttr("selected");
            jQuery("#ui-cartitem" + itemid + "-message").parent().find('select.ddlProductOptionItem option[value=' + itemid + ']').attr("selected", true);
            qtyIsValid = false;
        }
        else {
            qtyIsValid = true;
        }

        if (qtyIsValid) {
            window.location.href = "/cart/update/item/" + orderitemid + "/itemid/" + itemid + "/qty/" + qty;
        }

    }
});

Cart = new Cart();

function CartCheckInventoryTCS(itemid, qty, orderItemId) {
    if (qty === "") {
        var errorLocation = "#ui-cartitem" + itemid + "-message";
        changeAlert("Sorry, please enter a valid quantity.", "error", errorLocation);
        jQuery("#ui-cartitem" + itemid + "-message").parent().find("input.quantity").val(0);
        return;
    }
    jQuery('div#inventoryCheck').removeClass("hidden");
    var ran_number = Math.floor(Math.random() * 10000);
    var inventoryAjaxURL = '/cart/checkinventory?itemid=' + itemid + '&qty=' + qty + '&orderItemID=' + orderItemId + '&r=' + ran_number;

    //Firefox, Chrome and Safari all throw an error without this logic.
    var asyncRequest = false;
    if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent))
        asyncRequest = true;

    jQuery.ajax({
        type: "GET",
        url: inventoryAjaxURL,
        async: asyncRequest,
        success: function (data) {
            CartRefreshQtyTCS(data, qty, itemid, orderItemId);
        },
        error: function () {
            changeAlert("We're sorry, but there was an error connecting to the server. Please try again.", 'error', '#ui-alert-message');
        }
    });
}

function CartRefreshQtyTCS(data, qty, itemid, orderItemId) {
    var bQtyIsValid = false;
    var errorLocation = "#ui-cartitem" + itemid + "-message";
    bQtyIsValid = true;
    if (qty > data.QtyAvailable) {
        changeAlert("Sorry, the quantity requested is not available. Please click Update to add the updated quantity of " + data.QtyAvailable, "error", errorLocation);
        jQuery("#ui-cartitem" + itemid + "-message").parent().find("input.quantity").val(data.QtyAvailable);
        bQtyIsValid = false;
    }
    if (bQtyIsValid) {
        window.location.href = "/cart/update/item/" + orderItemId + "/itemid/" + itemid + "/qty/" + qty;
    }
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function cartUpdateSize(orderitemid, itemid, oldQty) {
    var qty = jQuery('#qty' + orderitemid).val();
    var itemid1 = $('#cartSizesSelect' + orderitemid).val();
    var newID = "ui-cartitem" + itemid1 + "-message";
    jQuery("div#ui-cartitem" + itemid + "-message").attr("id", newID);
    jQuery('#qty' + orderitemid).parent().find("input.cartProductID").val(itemid1);
    // call cart API to check inventory
    Cart.CheckInventory(orderitemid, itemid1, qty);

}

function cartUpdateItem(orderitemid, itemid, oldQty) {
    var qty = jQuery('#qty' + orderitemid).val();
    alert("api");
    // update item with cart API
    Cart.UpdateItem(orderitemid, itemid, qty);

}