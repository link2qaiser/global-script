/*
 *
 * CREATED AT 28 AUGUST 2018
 * AUTHER : QAISER
 * TWITTER: @LINK2QAISER
 *
 */
var site_url = "";
var current_url = "";
var paging_url = "";
var sort_by = "";
var order_by = "";
var es = false;

$(document).ready(function () {
  site_url = $("#site_url").html();
  current_url = $("#current_url").html();
  /*
  NO SPACE
  */
  $(document).on("keypress", ".nospace", function (event) {
    if (event.keyCode == 32) {
        return false;
    }
  });
  /*
  UPDAT TEXT OF ONE FILED WHEN TEXT OF SECOND FILED UPDATED
  */
  $(document).on("keyup", ".keysyn", function (event) {
    target = $(this).attr("data-change");
    $(target).val($(this).val());
  });
  /* 
    Full Secreen image viewer 
  */
  $(document).on("click", ".image-viewer", function (event) {
    var viewer = ImageViewer();
    viewer.show($(this).attr("src"));
  });
  /* 
    Change Connection Status 
  */
  $(document).on("change", ".change-status", function (event) {
    status = $(this).val();
    $.ajax({
      type: "GET",
      cache: false,
      url: $(this).data("url") + "?param=" + status,
      dataType: "json",
      headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
      success: function (res) {
        if (res.flag == true) {
          toastr["success"](res.msg, "Completed!");
          if (res.action == "reload") {
            window.location.reload();
          } else {
            $("." + remvove).remove();
          }
        }
      },
    });
  });
  /* Delete Function */
  $(document).on("click", ".list .delete", function (event) {
    var remvove = $(this).attr("data-remove");
    var attr = $(this).attr("data-action");
    //confirm("Do you want to delete");
    //addWaitWithoutText(this);
    $.ajax({
      type: "GET",
      cache: false,
      url: $(this).attr("data-url"),
      dataType: "json",
      headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
      success: function (res) {
        if (res.flag == true) {
          toastr["success"](res.msg, "Completed!");
          if (res.action == "reload") {
            window.location.reload();
          } else {
            $("." + remvove).remove();
          }
        }
      },
    });
  });

  /*
  DELETE FROM MODAL
  */
  $(document).on("click", ".data-model .delete", function (event) {
    addWaitWithoutText(this);
    $.ajax({
      type: "GET",
      cache: false,
      url: $(this).attr("data-url"),
      dataType: "json",
      headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
      success: function (res) {
        if (res.flag == true) {
          location.reload();
        } else {
          toastr["warning"](res.msg, "Oops!");
        }
      },
    });
  });
  /*
  AFTER AJAX CALL
  */
  function afterAajaxCall(status, res) {
    if(status == 'success') 
    {
      if (res.flag == true) {
        toastr["success"](res.msg, "Completed!");
      }
      if (res.flag == false) {
        toastr["error"](res.msg, "Alert!");
      }
      if (res.action == "close") {
        $("#data_modal").modal("hide");
      } else if (res.action == "reload") {
        window.location.reload();
      } else if (res.action == "redirect") {
        window.location.href = res.url;
      } else {
        $("." + remvove).remove();
      }
    }
    else 
    {
      $.each(err.responseJSON.errors, function (key, value) {
        var input = "input[name=" + key + "]";
        $(input).parent().addClass("has-error");
        var icon = $(input).parent(".input-icon").children("i");
        icon.removeClass("fa-check").addClass("fa-warning");
        icon
          .attr("data-original-title", value)
          .tooltip({ container: "body" });
        $(input).closest("div").nextAll("span").remove();
        $('<span class="text-danger">' + value + "</span>").insertAfter(
          $(input).closest("div")
        );
        $('label[for="' + key + '"]').addClass("text-danger");
      });
    }

  }

  /* 
  Make form submit ajax call
  */
  $(document).on("submit", "form.make_ajax", function (event) {

    var form = $(this).serialize();

    var btn = $(this).find("button[type=submit]");
    var btntxt = $(btn).html();
    res = validateForm("form.make_ajax");
    if (res.flag == false) {
      res.dom.focus().scrollTop();
      return false;
    }
    addWait(btn, "working...");

    $.ajax({
      type: $(this).attr("method"),
      contentType: false,
      cache: false,
      processData: false,
      dataType: "json",
      url: $(this).attr("action"),
      data: new FormData(this),
      headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
      success: function (res) {
        removeWait(btn, btntxt);
        afterAajaxCall('success',res);
        return false;
      },
      error: function (err) {
        removeWait(btn, btntxt);
        afterAajaxCall('success',res);
        return false;
      },
    });
    return false;
  });

  /*
  Make Ajax call with files
  */
  $(document).on("submit", "form.make_file_ajax", function (event) {
    event.preventDefault();
    var btn = $(this).find("button[type=submit]");
    var btntxt = $(btn).html();
    res = validateForm("form.make_file_ajax");
    if (res.flag == false) {
      res.dom.focus().scrollTop();
      return false;
    }
    addWait(btn, "working");
    $.ajax({
      type: $(this).attr("method"),
      contentType: false,
      cache: false,
      processData: false,
      dataType: "json",
      url: $(this).attr("action"),
      data: new FormData(this),
      headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
      success: function (res) {
        removeWait(btn, btntxt);
        if (res.flag) toastr["success"](res.msg, "Completed!");
        else toastr["warning"](res.msg, "Oops!");
        if (res.action == "reload") {
          window.location.reload();
        } else if (res.action == "redirect") {
          window.location.href = res.url;
        } else {
          $("." + remvove).remove();
        }
      },
      error: function () {
        removeWait(btn, btntxt);
        toastr["error"]("Something went wrong", "Opps!");
      },
    });
    return false;
  });
  $(document).on("submit", "form.make_ajax_model", function (event) {
    var form = $(this).serialize();
    var btn = "form.make_ajax_model button[type=submit]";
    var btntxt = $(btn).html();
    
    $.ajax({
      type: $(this).attr("method"),
      cache: false,
      url: $(this).attr("action") + "?" + form,
      dataType: "json",
      headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
      },
      success: function (res) {
        removeWait(btn, btntxt);
        if (res.flag) {
          $(".make_ajax_model select").val(null).trigger("change");
          $(".make_ajax_model").trigger("reset");
          if (JSON.parse(res.attached) == true) {
            key_number = JSON.parse(res.key_number);
            office_id = JSON.parse(res.office_id);
            listing_id = JSON.parse(res.list_ids);
            loadModal(
              "key-override",
              listing_id +
                "&office_id=" +
                office_id +
                "&key_number=" +
                key_number +
                "&seperate= "
            );
          } else {
            location.reload();
          }
        } else {
          toastr["warning"](res.msg, "Oops!");
        }
      },
    });
    return false;
  });

  /* 
  FORM VALIDATION CODE 
  */
  $(document).on("submit", "form.validate", function (event) {
    event.preventDefault();
    res = validateForm("form.validate");
    if (res.flag == false) {
      res.dom.focus().scrollTop();
    }
    return res.flag; //SUBMIT FUNCTION OR NO
  });

  $(".scrolto").click(function () {
    target = $(this).attr("data-target");
    $("html, body").animate(
      {
        scrollTop: $(target).offset().top - 186,
      },
      500
    );
  });
  /*
    DATE RANGE PICKER
  */
  $(".date_range_picker").each(function () {
    var dateRangeThis = this;
    var future = $(dateRangeThis).attr("data-future") == "false" ? false : true;
    var start_date = $(dateRangeThis).find("#start_date").val();
    var end_date = $(dateRangeThis).find("#end_date").val();

    $(this).daterangepicker(
      {
        opens: App.isRTL() ? "left" : "right",
        // startDate: moment().subtract('days', 29),
        maxDate: future ? false : moment(),
        startDate: start_date,
        endDate: end_date,
        //minDate: '01/01/2012',
        //maxDate: '12/31/2014',
        dateLimit: {
          days: 60,
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: future
          ? {
              Today: [moment(), moment()],
              Yesterday: [
                moment().subtract("days", 1),
                moment().subtract("days", 1),
              ],
              "Last 7 Days": [moment().subtract("days", 6), moment()],
              "Last 30 Days": [moment().subtract("days", 29), moment()],
              "This Month": [
                moment().startOf("month"),
                moment().endOf("month"),
              ],
              "Last Month": [
                moment().subtract("month", 1).startOf("month"),
                moment().subtract("month", 1).endOf("month"),
              ],
            }
          : {
              Today: [moment(), moment()],
              Yesterday: [
                moment().subtract("days", 1),
                moment().subtract("days", 1),
              ],
              "Last 7 Days": [moment().subtract("days", 6), moment()],
              "Last 30 Days": [moment().subtract("days", 29), moment()],
              "This Month": [moment().startOf("month"), moment()],
              "Last Month": [
                moment().subtract("month", 1).startOf("month"),
                moment().subtract("month", 1).endOf("month"),
              ],
            },
        buttonClasses: ["btn"],
        applyClass: "green",
        cancelClass: "default",
        format: "MM/DD/YYYY",
        separator: " to ",
        locale: {
          applyLabel: "Apply",
          fromLabel: "From",
          toLabel: "To",
          customRangeLabel: "Custom Range",
          daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
          monthNames: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          firstDay: 1,
        },
      },
      function (start, end) {
        $(dateRangeThis)
          .find("span")
          .html(
            start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY")
          );
        $(dateRangeThis).find("#start_date").val(start.format("MM/DD/YYYY"));
        $(dateRangeThis).find("#end_date").val(end.format("MM/DD/YYYY"));
      }
    );
    $(dateRangeThis)
      .find("span")
      .html(
        moment(start_date).format("MMMM D, YYYY") +
          " - " +
          moment(end_date).format("MMMM D, YYYY")
      );
  });
});
/*
DASHBOARD DATE RANGE PICKER FORM SUBMIT
*/
initDashboardDaterange = function() {
    if (!jQuery().daterangepicker) {
        return;
    }
    //qaiser here
    $('#header-date-range').daterangepicker({
        "ranges": {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last 7 Days': [moment().subtract('days', 6), moment()],
            'Last 30 Days': [moment().subtract('days', 29), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        },
        maxDate: new Date(),
        startDate: $("#daterangeform #start_date").val(),
        endDate: $("#daterangeform #end_date").val(),
        "locale": {
            "format": "YYYY-MM-DD",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
                "Su",
                "Mo",
                "Tu",
                "We",
                "Th",
                "Fr",
                "Sa"
            ],
            "monthNames": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],
            "firstDay": 1
        },
        //"startDate": "11/08/2015",
        //"endDate": "11/14/2015",
        opens: (App.isRTL() ? 'right' : 'left'),
    }, function(start, end, label) {
        if ($('#header-date-range').attr('data-display-range') != '0') {
            $('#header-date-range span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        $("#daterangeform #start_date").val(start.format("YYYY-MM-DD",));
        $("#daterangeform #end_date").val(end.format("YYYY-MM-DD",));
        
        $("#daterangeform").submit();
    });

     if ($('#header-date-range').attr('data-display-range') != '0') {
        start_date = moment($("#daterangeform #start_date").val()).format('MMMM D, YYYY');
        end_date = moment($("#daterangeform #end_date").val()).format('MMMM D, YYYY');

        $('#header-date-range span').html(start_date + ' - ' + end_date);
    }
    $('#header-date-range').show();
}
/*
FUNCTION REMOVE PARAMTER FROM QUERY STRING
*/
function removeURLParameter(url, parameter) {
  //prefer to use l.search if you have a location/link object
  var urlparts = url.split("?");
  if (urlparts.length >= 2) {
    var prefix = encodeURIComponent(parameter) + "=";
    var pars = urlparts[1].split(/[&;]/g);

    //reverse iteration as may be destructive
    for (var i = pars.length; i-- > 0; ) {
      //idiom for string.startsWith
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }

    url = urlparts[0] + "?" + pars.join("&");
    return url;
  } else {
    return url;
  }
}
/*
FORM VALIDATION (still incomplete)
*/
function validateForm(dom) {
  var inputs = $(
    dom +
      " input[type=text]," +
      dom +
      " textarea," +
      dom +
      " select," +
      dom +
      " input[type=password]"
  );
  var res = {};
  res.flag = true;

  inputs.each(function () {
    val = $(this).val();
    req = $(this).attr("required");

    if (val == "" && req != undefined) {
      if (res.flag == true) res.dom = $(this);
      res.flag = false;

      $(this).parent().addClass("has-danger");
      $(this).addClass("border-danger");
      var attr = $(this).attr("data-targeterror");
      if (typeof attr !== typeof undefined && attr !== false) {
        $(attr).addClass("has-danger");
      }
    } else {
      type = $(this).attr("data-type");
      req = $(this).attr("required");
      if (typeof type != "undefined" && req != undefined) {
        if (form.validate(type, val) == false) {
          if (res.flag == true) res.dom = $(this);
          res.flag = false;

          $(this).parent().addClass("has-danger");
          var attr = $(this).attr("data-targeterror");
          if (typeof attr !== typeof undefined && attr !== false) {
            $(attr).addClass("has-danger");
          }
        } else {
          $(this).parent().removeClass("has-danger");
          var attr = $(this).attr("data-targeterror");
          if (typeof attr !== typeof undefined && attr !== false) {
            $(attr).removeClass("has-danger");
          }
        }
      } else {
        $(this).parent().removeClass("has-danger");
        $(this).removeClass("border-danger");
        var attr = $(this).attr("data-targeterror");
        if (typeof attr !== typeof undefined && attr !== false) {
          $(attr).removeClass("has-danger");
        }
      }
    }
  });
  return res;
}

var form = {
  val: "",
  type: "",
  validate: function (type, val) {
    this.val = val;
    this.type = type;
    switch (this.type) {
      case "email":
        return this.isEmail();
        break;
      case "integer":
        return this.isInteger();
        break;
      case "url":
        return this.isUrl();
        break;
    }
  },
  isEmail: function () {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.val);
  },
  isInteger: function () {
    return /^\d+$/.test(this.val);
  },
  isUrl: function () {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(this.val);
  },
};

function loadModal(url, param, param2, param3) {
  $("#data_modal .modal-content").html(
    '<p style="text-align: center;"><br/> <i class="fa fa-spinner fa-spin"></i>  Please wait loading...</p>'
  );

  if (typeof param === "undefined") param = null;
  if (typeof param2 === "undefined") param2 = null;
  if (typeof param3 === "undefined") param3 = null;
  url =
    site_url +
    "/modal/" +
    url +
    "?param=" +
    param +
    "&param2=" +
    param2 +
    "&param3=" +
    param3;
  console.log(url);
  $.ajax({
    type: "GET",
    cache: false,
    url: url,
    //dataType: "json",
    success: function (result) {
      $(".all-modals .modal-content").html(result);
      FormInputMask.init();
      ComponentsDateTimePickers.init();
      /*BootstrapDatepicker.init();
            Select2.init();
            FormRepeater.init();*/
    },
  });
}

function addWait(dom, lable) {
  $(dom).attr("disabled", "disabled");
  string = '<i class="fa fa-spinner fa-spin"></i> ' + lable;
  $(dom).html(string);
}

function removeWait(dom, lable) {
  $(dom).removeAttr("disabled");
  $(dom).html(lable);
}

function addWaitWithoutText(dom) {
  $(dom).attr("disabled", "disabled");
  string = '<i class="m-loader"></i>';
  $(dom).html(string);
}

function removeWaitWithoutText(dom, lable) {
  $(dom).removeAttr("disabled");
  $(dom).html(lable);
}

function ImportaddWaitWithoutText(dom) {
  $(dom).attr("disabled", "disabled");
  string = '<i class="m-loader">Importing</i>';
  $(dom).html(string);
}

toastr.options = {
  closeButton: true,
  debug: false,
  positionClass: "toast-top-right",
  onclick: null,
  showDuration: "1000",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(".view_upload_image").attr("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

var getDaysFromDates = function (firstDate, secondDate) {
  oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  firstDate = new Date(firstDate);
  secondDate = new Date(secondDate);
  return Math.round(
    Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
  );
};

var addDays = function (date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

var formatDate = function (date, spilter) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join(spilter);
};

$(".upload-image").change(function () {
  readURL(this);
});

/*
SELECT2
*/

$(".select2box").select2({
  placeholder: "Select One",
  enableFiltering: true,
  allowClear: true,
});
function initiateSelect2() {
  $(".select2").select2({
    placeholder: " ",
    allowClear: true,
    dropdownParent: $("#data_modal"),
    theme: "bootstrap",
  });
}

/*
EDIT THE NOTE / DESCRIPTION 
*/
$(document).on("click", "#edit_note", function (event) {
  var prehtml = $(this).closest("td").find("#des_text").text();
  var textarea = '<textarea style= "width: 100%;">' + prehtml + "</textarea>";
  $(this).closest("td").find("#des_text").html(textarea);
  $(this).closest("td").find("#save_note").show();
  $(this).closest("td").find("#cancel_note").show();
  $(this).closest("td").find("#edit_note").hide();
});
$(document).on("click", "#save_note", function (event) {
  var selector = $(this);

  selector.find("a").text("saving....");
  var prehtml = selector.closest("td").find("textarea").val();
  var action = selector.find("a").attr("data-action");
  selector.removeAttr("id");
  $.ajax({
    type: "POST",
    cache: false,
    url: action,
    dataType: "json",
    data: { note: prehtml },
    headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
    success: function (res) {
      console.log(res);
      selector.attr("id", "save_note");
      selector.closest("td").find("#des_text").html(prehtml);
      selector.closest("td").find("#save_note").hide();
      selector.closest("td").find("#cancel_note").hide();
      selector.closest("td").find("#edit_note").show();
      selector
        .closest("td")
        .find("#edit_by")
        .text("Last Edit: " + res.data.edit_by);
      selector.find("a").text("save");
      //
    },
  });
});
$(document).on("click", "#cancel_note", function (event) {
  var selector = $(this);

  var prehtml = selector.closest("td").find("textarea").val();
  selector.closest("td").find("#des_text").html(prehtml);
  selector.closest("td").find("#save_note").hide();
  selector.closest("td").find("#cancel_note").hide();
  selector.closest("td").find("#edit_note").show();
});

/*
SEO URL method
*/
function converToSEO(txt_src){

 var output = txt_src.replace(/[^a-zA-Z0-9]/g,' ').replace(/\s+/g,"-").toLowerCase();
 /* remove first dash */
 if(output.charAt(0) == '-') output = output.substring(1);
 /* remove last dash */
 var last = output.length-1;
 if(output.charAt(last) == '-') output = output.substring(0, last);
 
 return output;
}
$(document).on("keyup", ".seo-url", function (event) {
  
  let val = $(this).val();
  console.log(val);
  let target = $(this).attr("data-target");
  $(target).val(converToSEO(val));
});