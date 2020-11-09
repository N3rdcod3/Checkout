$(function () {
    //alert("Anjan");
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
         

     })
});