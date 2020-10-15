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
                       html = '<tr> <td></td> <td><input type="text" name="Serial[]" value="" class="form-control serialFieldCon" required="" placeholder="Scan Serial or Type" /></td> <td><input type="text" name="RouterName[]" class="form-control" required="" placeholder="Router Name" /><input type="hidden" class="RouterId" name="sr_id[]"></td> <td nowrap=""> <a href="javascript:void(0);" class="btn btn-danger m-btn m-btn--icon m-btn--icon-only delete"> <i class="la la-trash"></i> </a></td> </tr>';
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
  
