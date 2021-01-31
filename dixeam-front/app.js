/*
 *
 * CREATED AT 28 AUGUST 2018
 * AUTHER : QAISER
 * TWITTER: @LINK2QAISER
 *
 */
var site_url    =   "";
var current_url =   "";
var paging_url  =   "";
var sort_by     =   "";
var order_by    =   "";
var es          =   false;

$(document).ready(function() {
    
    site_url    =   $("#site_url").html();
    current_url =   $("#current_url").html();
   
    /* IF ATTENDANCE DATE CHANGE THEN PICK EMPLOYEE ACCIRDING TO THAT DATE */
    $("#attendance_date").change(function () {
        window.location =   site_url+'/attendance/create-view?date=' + this.value;
    });
    $(document).on('change','.Payments',function(){
        var value = $(this).val();
        if(value=='2'){
            $('.bank_module').show();
            $(".bank_module :input").attr("disabled", false);
        }
        else{
            $('.bank_module').hide();
            $(".bank_module :input").attr("disabled", true);
        }
    });
    /* Full Secreen image viewer */
    $(document).on("click", ".image-viewer", function(event) {
        var viewer = ImageViewer();
        viewer.show($(this).attr('src'));
    });
    // Reminder Type change
    $(document).on('change','.remind_type',function(){
        const typeValue = $(this).val();
        if(typeValue==1){
            $('#remindDays').show();
            $('#remindDate').hide();
            $('#remindDate').children(':input').prop('disabled',true);
            $('#remindDays').children(':input').prop('disabled',false);
        }else if(typeValue==2){
            $('#remindDays').hide();
            $('#remindDate').show();
            $('#remindDate').children(':input').prop('disabled',false);
            $('#remindDays').children(':input').prop('disabled',true);
        }else{
            $('#remindDays').hide();
            $('#remindDate').hide();
        }
    });

    // Role Change
    $(document).on('change','.employeeRole',function(){
        const typeValue = $(this).val();
        if(typeValue==101){
            $('#receiveAmount,#payAmount').show();
            $
        }else{
            $('#receiveAmount,#payAmount').hide();
        }
    });

    /* Change Connection Status */
    $(document).on("change", ".change-status", function(event) {
        status  =  $(this).val();
        $.ajax({
            type:       "GET",
            cache:      false,
            url:        $(this).data("url")+'?param='+status,
            dataType:   "json",
            headers:    { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            success: function(res) {
                if (res.flag == true) {
                    toastr["success"](res.msg, "Completed!");
                    if(res.action == 'reload') {
                        window.location.reload();
                    }else{
                        $("." + remvove).remove();
                    }
                }
            }
        });
    });

    /* Set Featured Image Function */
    $(document).on('change','.featured-image',function(){
        let id = $(this).val();
        let url = $(this).attr("url");
        url = site_url+'/'+url+'/'+id;
        $.ajax({
            type : "GET",
            cache: false,
            url  : url,
            dataType:"json",
            success:function(data){
                console.log(data);
            },
            error:function(error){
                console.log(error);
            }
        })
    });

    /* DELETE FUNTION */

    $(document).on("click", ".list .delete", function(event) {
        var remvove =   $(this).attr("data-remove");
        var attr    =   $(this).attr('data-action');
        //confirm("Do you want to delete");
        //addWaitWithoutText(this);
        $.ajax({
            type:       "GET",
            cache:      false,
            url:        $(this).attr("data-url"),
            dataType:   "json",
            headers:    { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            success: function(res) {
                if (res.flag == true) {
                    toastr["success"](res.msg, "Completed!");
                    if(res.action == 'reload') {
                        window.location.reload();
                    }else{
                        $("." + remvove).remove();
                    }
                }
            }
        });
    });

    $(document).on("click", ".data-model .delete", function(event) {
        addWaitWithoutText(this);
        $.ajax({
            type:       "GET",
            cache:      false,
            url:        $(this).attr("data-url"),
            dataType:   "json",
            headers:    {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            success: function(res) {
                if (res.flag == true) {
                    location.reload();
                } else {
                    toastr["warning"](res.msg, "Oops!");
                }
            }
        });
    });

    $(document).on("click", ".importgoogle", function(event) {
        ImportaddWaitWithoutText(this);
        $.ajax({
            type:       "GET",
            cache:      false,
            url:        $(this).attr("data-url"),
            dataType:   "json",
            headers:    {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            success: function(res) {
                if (res.flag == true) {
                    location.reload();
                }else{
                    removeWaitWithoutText(".importgoogle", '<span><i class="fa fa-copy"></i><span>Import Events</span></span>');
                    toastr["warning"](res.msg, "Oops!");
                }
            }
        });
    });

    /* Backup you can delete it later */
    $(document).on("submit", "form.searchfilter", function(event) {
        var form = $(this).serialize();
        var btnText = $(this).find("button[type=submit]").text();
        
        //addWait("form.searchfilter button[type=submit]", "searching...");
        $.ajax({
            type: $(this).attr("method"),
            cache: false,
            url: $(this).attr("action") + "?" + form,
            //dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(res) {
                removeWait("form.searchfilter button[type=submit]", btnText);
                if (res != "")
                    $("#data_list").html(res);
            }
        });
        return false;
    });

    /* MAKE AJAX CALL */
    $(document).on("submit", "form.make_ajax", function(event) {
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
            type:       $(this).attr("method"),
            cache:      false,
            url:        $(this).attr("action") + "?" + form,
            dataType:   "json",
            headers:    {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            success: function(res) {
                removeWait(btn, btntxt);
                if (res.flag == true) {
                    toastr["success"](res.msg, "Completed!");
                }
                if (res.flag == false) {
                    toastr["error"](res.msg, "Alert!");
                }
                if(res.action == 'close') {
                    $('#data_modal').modal('hide');
                }
                else if(res.action == 'reload') {
                    window.location.reload();
                }else{
                    $("." + remvove).remove();
                }  
            },
            error:function(err){
                removeWait(btn, btntxt);
                $.each(err.responseJSON.errors, function (key, value) {
                    var input = 'input[name='+key+']';
                    $(input).parent().addClass('has-error');
                    var icon  = $(input).parent('.input-icon').children('i');
                    icon.removeClass('fa-check').addClass("fa-warning");  
                    icon.attr("data-original-title", value).tooltip({'container': 'body'});
                    $(input).closest("div").nextAll('span').remove();
                    $('<span class="text-danger">'+value+'</span>').insertAfter($(input).closest("div"));
                    $('label[for="'+key+'"]').addClass('text-danger');
                });
            }
        });
        return false;
    });

    /*Make Ajax call with files */
    $(document).on("submit", "form.make_file_ajax", function(event) {
        event.preventDefault();
        var btn     =   $(this).find("button[type=submit]");
        var btntxt  =   $(btn).html();
        res = validateForm("form.make_file_ajax");
        if (res.flag == false) {
            res.dom.focus().scrollTop();
            return false;
        }
        addWait(btn, "working");
        $.ajax({
            type:           $(this).attr("method"),
            contentType:    false,     
            cache:          false, 
            processData:    false, 
            dataType:       "json",
            url:            $(this).attr("action"),
            data:           new FormData(this),
            headers:        {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            success: function(res) {
                removeWait(btn, btntxt);
                if (res.flag)
                    toastr["success"](res.msg, "Completed!");
                else
                    toastr["warning"](res.msg, "Oops!");
                if (res.action == 'reload') {
                    window.location.reload();
                }
            },
            error: function () {
                removeWait(btn, btntxt);
                toastr["error"]("Something went wrong","Opps!");
            }
        });
        return false;
    });

    $(document).on("change", "#perpage", function(event) {
        val = $(this).val();
        window.location.href = current_url + "?perpage=" + val;
    });

    $(document).on("submit", "form.make_ajax_model", function(event) {
        var form = $(this).serialize();
        var btn = "form.make_ajax_model button[type=submit]";
        var btntxt = $(btn).html();
        /*res = validateForm("form.make_ajax_model");
        if (res.flag == false) {
            res.dom.focus().scrollTop();
            return false;
        }*/

        //addWait(btn, "working...");
        $.ajax({
            type: $(this).attr("method"),
            cache: false,
            url: $(this).attr("action") + "?" + form,
            dataType: "json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(res) {
                removeWait(btn, btntxt);
                if (res.flag) {
                    $('.make_ajax_model select').val(null).trigger('change');
                    $('.make_ajax_model').trigger("reset");
                    if (JSON.parse(res.attached) == true) {
                        key_number = JSON.parse(res.key_number);
                        office_id = JSON.parse(res.office_id);
                        listing_id = JSON.parse(res.list_ids);
                        loadModal('key-override', listing_id + '&office_id=' + office_id + '&key_number=' + key_number + '&seperate= ');
                    } else {
                        location.reload();
                    }
                } else {
                    toastr["warning"](res.msg, "Oops!");
                }

            }
        });
        return false;
    });

    /* FORM VALIDATION CODE */
    $(document).on("submit", "form.validate", function(event) {
        event.preventDefault();
        res     =   validateForm("form.validate");
        if (res.flag == false) {
            res.dom.focus().scrollTop();
        }
        return res.flag; //SUBMIT FUNCTION OR NO
    });

    $(".scrolto").click(function() {
        target = $(this).attr('data-target');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 186
        }, 500);
    });
});

function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;) {
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        url = urlparts[0] + '?' + pars.join('&');
        return url;
    } else {
        return url;
    }
}

function validateForm(dom) {
    var inputs  =   $(dom + " input[type=text]," + dom + " textarea," + dom + " select," + dom + " input[type=password]");
    var res     =   {};
    res.flag    =   true;

    inputs.each(function() {
        val =   $(this).val();
        req =   $(this).attr("required");

        if (val == ""  && req != undefined) {
            if (res.flag == true) res.dom = $(this);
            res.flag = false;

            $(this).parent().addClass('has-danger');
            $(this).addClass('border-danger');
            var attr = $(this).attr('data-targeterror');
            if (typeof attr !== typeof undefined && attr !== false) {
                $(attr).addClass('has-danger');
            }
        }else{
            type    =   $(this).attr('data-type');
            req     =   $(this).attr("required");
            if (typeof(type) != "undefined" && req != undefined) {
                if (form.validate(type, val) == false) {
                    if (res.flag == true)
                        res.dom = $(this);
                    res.flag = false;

                    $(this).parent().addClass('has-danger');
                    var attr = $(this).attr('data-targeterror');
                    if (typeof attr !== typeof undefined && attr !== false) {
                        $(attr).addClass('has-danger');
                    }
                } else {
                    $(this).parent().removeClass('has-danger');
                    var attr = $(this).attr('data-targeterror');
                    if (typeof attr !== typeof undefined && attr !== false) {
                        $(attr).removeClass('has-danger');
                    }
                }
            } else {
                $(this).parent().removeClass('has-danger');
                $(this).removeClass('border-danger');
                var attr = $(this).attr('data-targeterror');
                if (typeof attr !== typeof undefined && attr !== false) {
                    $(attr).removeClass('has-danger');
                }
            }
        }
    });
    return res;
}

var form = {
    val: "",
    type: "",
    validate: function(type, val) {
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
    isEmail: function() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.val);
    },
    isInteger: function() {
        return /^\d+$/.test(this.val);
    },
    isUrl: function() {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(this.val);
    }
}

function loadModal(url, param,param2,param3) {
    $("#data_modal .modal-content").html('<p style="text-align: center;"><br/> <i class="fa fa-spinner fa-spin"></i>  Please wait loading...</p>');

    if (typeof(param)   === 'undefined') param  = null;
    if (typeof(param2)  === 'undefined') param2 = null;
    if (typeof(param3)  === 'undefined') param3 = null;
    url = site_url + "/dashboard/modal/" + url + "?param=" + param+ "&param2=" + param2 + "&param3=" + param3;
    console.log(url);
    $.ajax({
        type: "GET",
        cache: false,
        url: url,
        //dataType: "json",
        success: function(result) {
            $(".all-modals .modal-content").html(result);
            FormInputMask.init();
            ComponentsDateTimePickers.init(); 
            /*BootstrapDatepicker.init();
            Select2.init();
            FormRepeater.init();*/
        }
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
    "closeButton": true,
    "debug": false,
    "positionClass": "toast-top-right",
    "onclick": null,
    "showDuration": "1000",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('.view_upload_image').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

var getDaysFromDates = function(firstDate, secondDate) {
    oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    firstDate = new Date(firstDate);
    secondDate = new Date(secondDate);
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
}

var addDays = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

var formatDate = function(date, spilter) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join(spilter);
}

$(".upload-image").change(function() { readURL(this); });


/*
CUSTOMER JS
*/
$(document).ready(function() {

    $(document).on('keydown', '.serialFieldCon', function(ev) {
        var val = $(this).val();  
        dom = $(this);

        if(ev.which === 13) {
            $(this).attr("disabled","");
             $.ajax({
                type: "GET",
                cache: false,
                url: site_url+"/custumers/router/add?serial="+val,
                dataType: "json",
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                success: function(res) {

                    if(res.list.length == 0) {
                        dom.closest('tr').addClass('error-back');
                        dom.val("");
                        //dom.focus();
                        setTimeout(function() { dom.focus() }, 1000);
                        dom.removeAttr("disabled","");
                        return false;
                        
                    }else {
                        dom.closest('tr').removeClass('error-back');
                       
                       dom.closest('tr').find('.RouterName').val(res.list[0].Label);
                       dom.closest('tr').find('.RouterId').val(res.list[0].sr_id);
                       html = '<tr> <td></td> <td><input type="text" name="Serial[]" value="" class="form-control serialFieldCon" required="" placeholder="Scan Serial or Type" /></td> <td><input type="text" name="RouterName[]" class="form-control" required="" placeholder="Router Name" /><input type="hidden" class="RouterId" name="sr_id[]"></td> <td nowrap=""> <a href="javascript:void(0);" class="btn btn-danger m-btn m-btn--icon m-btn--icon-only delete"> <i class="fa fa-trash"></i> </a></td> </tr>';
                       $("#add_roter_list tbody").append(html);
                       $("#add_roter_list tbody tr:last .serialFieldCon").focus();
                       dom.removeAttr("disabled","");
                       $("#add_roter_list tbody tr").each(function(index) {
                            $(this).children('td').first().text(index + 1);
                        });
                       return false;
                    }
                    
                }
            });
             
            return false;

        }
        
    });
    $(document).on("click", "#add_roter_list .delete", function(event) {
        console.log("test");
        $(this).closest('tr').remove();
        $("#add_roter_list tbody tr").each(function(index) {
            $(this).children('td').first().text(index + 1);
        });
    });
});
/*
SELECT2
*/

$(".select2box").select2({
    placeholder: 'Select One',
    enableFiltering:true,
    allowClear:true,
});
$(document).on('change','#material',function(){
    var value = $(this).val();
    // alert(value);
    if(value==1){
        $('#withmaterial').show();
    }else{
        $('#withmaterial').hide();
    }
});

function initiateSelect2() {
  $('.select2').select2({
     placeholder: " ",
     allowClear: true,
     dropdownParent: $('#data_modal'),
     theme: "bootstrap"
  });
}

// when modal is open
$('.modal').on('shown.bs.modal', function () {
  initiateSelect2();
});


/*
PURCHASE JS
*/
$(document).ready(function() {
    $('#withmaterial').hide();
    if($(".serialfield").length == 1)
        $(".serialfield").focus();
    $(document).on('keydown', '.serialfield', function(ev) {
        if(ev.which === 13) {
            html = '<tr><td></td><td><input type="text" name="Serial[]"  class="form-control serialfield" required=""   /></td><td nowrap=""><a href="javascript:void(0);"  class="btn btn-danger m-btn m-btn--icon m-btn--icon-only delete" title="View"><i class="fa fa-trash"></i></a></td></tr>';
            $("#roter_list tbody").append(html);
            $("#roter_list tbody tr:last .serialfield").focus();

        }
        $("#roter_list tbody tr").each(function(index) {
            $(this).children('td').first().text(index + 1);
        });
    });
    $(document).on("click", "#roter_list .delete", function(event) {
       $(this).closest('tr').remove();
       $("#roter_list tbody tr").each(function(index) {
            $(this).children('td').first().text(index + 1);
        });
    });
});
  
/* COMPLAIN SCRIPT*/

var filterUser = function() {
    var parent = '#data_modal';
    attr = $('.customer_slect2ajax').attr('data-parent');
    if (typeof attr !== typeof undefined && attr !== false) {
        parent = attr;
    }
    $('.customer_slect2ajax').select2({
          placeholder: "Select Customer",
          allowClear: true,
          dropdownParent: $('#data_modal'),
          ajax: {
            url: site_url+'/customers/filter',
            dataType: 'json',
            processResults: function (data) {
                
                for(i = 0; i < data.length; i++){
                    data[i]['text'] = data[i]['first_name'] + " "+data[i]['last_name']+ " - "+data[i]['mobile_no'] ;
                    data[i]['id'] = data[i]['cus_id'];
                }
                console.log(data);
                return {
                    results: data
                };
                
            },
          },
          escapeMarkup: function(d) {
            return d;
              },
          templateResult: function (d) { 
            return $('<table width="100%;"><tbody><tr><td>'+d.first_name +" "+d.last_name+'</td><td align="right">CNIC: '+d.cnic+'</td></tr><tr><td>'+d.address +'</td><td align="right">Username: '+d.username+'</td></tr><tbody></table>');  
          },
          
          processResults: function (d) {
            cnic = (typeof d.cnic == 'undefined')?'':' ('+d.cnic+')';
            return d.text + cnic;  
          },
          minimumInputLength: 1
    });
    
}
 
/* EMPLOYEE SCRIPT*/

var filterEmployee = function() {
    var isMultiple = true;
    attr = $(this).attr('multiple');
    if (typeof attr !== typeof undefined && attr !== false) {
        isMultiple = false;
    }
    console.log(isMultiple);
    $('.employee_slect2ajax').select2({
          placeholder: "Assign to Employee",
          allowClear: true,
          multiple:isMultiple,
          dropdownParent: $('#data_modal'),
          ajax: {
            url: site_url+'/employees/filter',
            dataType: 'json',
            processResults: function (data) {
                
                for(i = 0; i < data.length; i++){

                    data[i]['text'] = data[i]['first_name'] + " "+data[i]['last_name'];
                    if(data[i]['phone'] == "undefined")
                        data[i]['text'] += " - "+ data[i]['phone'] ;
                    data[i]['id'] = data[i]['id'];
                }
                console.log(data);
                return {
                    results: data
                };
                
            },
          },
          escapeMarkup: function(d) {
            return d;
              },
          templateResult: function (d) {

            return $('<table width="100%;"><tbody><tr><td>'+d.first_name +" "+d.last_name+'</td><td align="right">CNIC: '+d.phone+'</td></tr><tbody></table>');  
          },
          
          processResults: function (d) {
            
          },
          minimumInputLength: 1
    });
    
}