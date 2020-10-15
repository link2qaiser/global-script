$(document).ready(function() {
    if($(".serialfield").length == 1)
        $(".serialfield").focus();
    $(document).on('keydown', '.serialfield', function(ev) {
        if(ev.which === 13) {
            html = '<tr><td></td><td><input type="text" name="Serial[]"  class="form-control serialfield" required=""   /></td><td nowrap=""><a href="javascript:void(0);"  class="btn btn-danger m-btn m-btn--icon m-btn--icon-only delete" title="View"><i class="la la-trash"></i></a></td></tr>';
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
  
