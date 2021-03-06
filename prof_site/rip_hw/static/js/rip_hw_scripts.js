console.log('get into scripts.js');


function calc_price(){
    console.log('calculating price');
    var start_date = new Date($('#id_start_date_year').val(), $('#id_start_date_month').val(), $('#id_start_date_day').val());
    var end_date = new Date($('#id_end_date_year').val(), $('#id_end_date_month').val(), $('#id_end_date_day').val());

    var diff_days = (end_date-start_date)/1000/60/60/24;
    if(diff_days <= 0){
        $("#id_price").val('Ошибка.');
        $("#date_errors").text('Ошибка. Отбытие раньше прибытия.');
        $("#date_errors").show();
        console.log('diff',diff_days);
    }
    else{
        $("#id_price").val(diff_days*1000);
        //document.getElementsById('id_price').value = diff*1000;
        $("#date_errors").hide();
        console.log('diff',diff_days);
    }
}

function load_last_bookings(){
    if($("#traveler_name").text().length==0){
        return;
    }
    console.log('loading last_bookings');
    $.ajax({
            type: "GET",
            url: '/rip_hw/ajax/last_bookings/',
            data: {
                'hotel_name': $("#hotel_name").text(),
                'user_email': $("#traveler_email").text(),
            },
            dataType: 'html',
            success: function(data){
                if(data == '-'){
                    return;
                }

                $('#last_bookings_header').show();
                $('#last_bookings').html(data);

                console.log('success');
                console.log(data);
            },
            failure: function(data){
                console.log('failure');
                console.log(data);
            }
        })
}


$(document).ready(function(){
    console.log('Document is ready');

    if(document.URL.match('hw/hotels')){
        if($("#traveler_name").text().length==0) {
            console.log("disabling");
            $(".btn_modal_booking").attr("disabled", "disabled"); //Это для бутстрапа
            $(".btn_modal_booking").prop("disabled",True); //Это для js, чтобы кнопка не нажималась
        }
        load_last_bookings();
        $("#id_start_date_month").change(calc_price);
        $("#id_start_date_day").change(calc_price);
        $("#id_start_date_year").change(calc_price);
        $("#id_end_date_month").change(calc_price);
        $("#id_end_date_day").change(calc_price);
        $("#id_end_date_year").change(calc_price);
    }

    //при нажатию на любую кнопку, имеющую класс .btn_modal_booking
    $(".btn_modal_booking").click(function() {
        //открыть модальное окно с id="myModal"
        $("#modalBooking").modal('show');
        $("#id_user").val($('#traveler_name').text());
        $("#id_hotel").val($('#hotel_name').text());
        calc_price()
    });

    $('#btn_book').click(function() {
        if(isNaN(Number($('#id_price').val()))){ //Если стоимость - не число => ошибка
            return;
        }

        var csrf_value = document.getElementsByName("csrfmiddlewaretoken")[0].getAttribute("value");
        console.log(csrf_value)
        $.ajax({
            type: "POST",
            url: '/rip_hw/ajax/book/',
            data: {
                'hotel_name': $("#id_hotel").val(),
                'user_email': $("#traveler_email").text(),
                'price': $("#id_price").val(),
                //'start_date': Date($('#id_start_date_year').val(), $('#id_start_date_month').val(), $('#id_start_date_day').val()),
                //'end_date': Date($('#id_end_date_year').val(), $('#id_end_date_month').val(), $('#id_end_date_day').val()),
                'start_year': $("#id_start_date_year").val(),
                'start_month': $("#id_start_date_month").val(),
                'start_day': $("#id_start_date_day").val(),
                'end_year': $("#id_end_date_year").val(),
                'end_month': $("#id_end_date_month").val(),
                'end_day': $("#id_end_date_day").val(),
                csrfmiddlewaretoken: csrf_value,
            },
            dataType: 'html',
            success: function(data){
                $('#success_booking').text('Бронирование успешно выполнено');
                $('#success_booking').show();
                $('#btn_book').hide();

                console.log('success');
                console.log(data);
            },
            failure: function(data){
                console.log('failure');
                console.log(data);
            },
            complete: function(){
                load_last_bookings();
            },
        })
    })
});
