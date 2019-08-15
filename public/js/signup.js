


var clickzoneValue = false
var clickcountry = false
var clickcity = false 


  function change() {
  
    document.getElementById("update").style.display = "none";
    document.getElementById("close").style.display = "block";
  }
 
var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirm_password");
function validatePassword() {
  if (password.value != confirm_password.value) {
  
    confirm_password.setCustomValidity("Passwords Don't Match");
    
  } else {
    confirm_password.setCustomValidity('');
  }
}
password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;
 






$(function() {
    $("#Zone").on("click", function () {
      console.log( $("#Zone").val());
      var Zone = $('#Zone').val();
      $.ajax({
        type: 'post',
        url: '/getCountry',
        dataType: "text",  
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          Zone: Zone
        }),
               
          cache: false,
            timeout: 5000,
            complete: function() {
             
              console.log('process complete');
              console.log(data.Country)
            },
            success: function(res) {
              
              var resu = JSON.parse(res)
     var html;        
    
     html = ''
      
     for (var i = 0; i< resu.country.length; i++) {
      
        html += '<option value ="'+ resu.country[i]._id + '">' + resu.country[i].Country +  '</option>';
      
    }
    html += ''
     
     $('#getCountry').html(html);
   },
            error: function() {
             
              console.log('process error');
            },
      
      });
    });
  });

 

   // function get city

   $(function() {
    $("#getCountry").on("click", function () {
      console.log("11212121")
      console.log( $("#getCountry").val());
      var Country = $('#getCountry').val();
      $.ajax({
        type: 'post',
        url: '/getCiy',
        dataType: "text",  
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          Country: Country
        }),
               
          cache: false,
            timeout: 5000,
            complete: function() {
             
              console.log('process complete');
              console.log(data.country)
            },
            success: function(res) {
              
              var resu = JSON.parse(res)
     var html;        
    
     html = ''
      
     for (var i = 0; i< resu.city.length; i++) {
      
        html += '<option value ="'+ resu.city[i]._id + '">' + resu.city[i].City +  '</option>';
      
    }
    html += ''
     
     $('#getCity').html(html);
   },
            error: function() {
             
              console.log('process error');
            },
      
      });
    });
  });
 
 

  function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
    document.getElementById("mySidenav").style.marginRight = "0";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.marginRight = "-100%";
    document.getElementById("mySidenav").style.width = "0";
  }
