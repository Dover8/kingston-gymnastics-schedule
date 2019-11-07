jQuery(document).ready(function(){
    moment.locale('en', {
      week: { dow: 1 } // Monday is the first day of the week
    });

  //Initialize the datePicker(I have taken format as mm-dd-yyyy, you can     //have your owh)
  $("#datepicker").datetimepicker({
      format: 'DD-MM-YYYY'
  });

   //Get the value of Start and End of Week
      var value = $("#weeklyDatePicker").val();
      var firstDate = moment(value, "DD-MM-YYYY").day(1).format("DD-MM-YYYY");
      var lastDate =  moment(value, "DD-MM-YYYY").day(7).format("DD-MM-YYYY");
      $("#weeklyDatePicker").val(firstDate + " - " + lastDate);
  $('#datepicker').on('dp.change', function (e) {
  });
});