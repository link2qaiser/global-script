var FormInputMask = function () {
    
    var handleInputMasks = function () {
        $(".cnic_mask").inputmask("99999-9999999-9", {
            
        }),
        $(".integer_mask").inputmask({
            "mask": "9",
            "repeat": 10,
            "greedy": false
        }),
        $(".phone_mask").inputmask("9999-9999999", {
          
        }),
        $('.price_mask').inputmask("numeric", {
            radixPoint: ".",
            groupSeparator: ",",
            digits: 2,
            autoGroup: true,
            prefix: 'Rs ', //Space after $, this will not truncate the first character.
            rightAlign: false,
            oncleared: function () { self.Value(''); }
        })
        
    }


    return {
        //main function to initiate the module
        init: function () {
            handleInputMasks();
        }
    };

}();

if (App.isAngularJsApp() === false) { 
    jQuery(document).ready(function() {
        FormInputMask.init(); // init metronic core componets
    });
}