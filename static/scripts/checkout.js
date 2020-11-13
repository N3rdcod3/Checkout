$(function () {    
});

$('#checkout-btn').click(function(){
    $.ajax({
        url:'/getPaymentMethods',
        type: 'GET',
        datatype:'html'
     })
     .then(function(r){
        $("#paymentoptions").html(r);
         $("#paymentoptions").show();
         $("#proceed").hide();
         $(".cardicon").first().addClass('selectedcardtype');
         $('.cardicon').click(function(){
            $('.selectedcardtype').removeClass('selectedcardtype');
            $(this).addClass('selectedcardtype');
        });
        $(".cardicon").first().click();
        $('#paymentMethod').on("submit", function(){
            var formdata = $(this).serializeArray();
            $.ajax({
                url:'/initatepayment',
                type: 'POST',
                datatype:'json',
                data: formdata
             })
             .then(function(r){
                 console.log(r);
             });
             return false;
        });
     })
});

var activecardtype;
function CardTypeSelected(type){
    activecardtype = type;
    $("#paymentMethod [name='type']").val(type);
}



