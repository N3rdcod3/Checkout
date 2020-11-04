$(function () {
    //alert("Anjan");
});

$('#checkout-btn').click(function(){

    $.ajax({
        url:'/getPaymentMethods',
        type: 'GET',
        datatype:'JSON'
     })
     .then(function(r){
         console.log(r);
     })
});