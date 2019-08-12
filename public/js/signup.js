


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
 

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
// This function will display the specified tab of the form...
var x = document.getElementsByClassName("tab");
x[n].style.display = "block";
//... and fix the Previous/Next buttons:
if (n == 0) {
document.getElementById("prevBtn").style.display = "none";


} else {


document.getElementById("prevBtn").style.display = "inline";
}
if (n == (x.length - 1)) {

 document.getElementById("nextBtn").type = "sunmit";
} else {
document.getElementById("nextBtn").innerHTML = "التالي";

}
//... and run a function that will display the correct step indicator:
fixStepIndicator(n)
}

function nextPrev(n) {
// This function will figure out which tab to display
var x = document.getElementsByClassName("tab");
// Exit the function if any field in the current tab is invalid:
if (n == 1 && !validateForm()) return false;
// Hide the current tab:
x[currentTab].style.display = "none";
// Increase or decrease the current tab by 1:
currentTab = currentTab + n;
// if you have reached the end of the form...
if (currentTab >= x.length) {
// ... the form gets submitted:
document.getElementById("regForm").submit();
return false;
}
// Otherwise, display the correct tab:
showTab(currentTab);
}

function validateForm() {
// This function deals with validation of the form fields
var x, y, i, valid = true;
x = document.getElementsByClassName("tab");
y = x[currentTab].getElementsByTagName("input");
// A loop that checks every input field in the current tab:
for (i = 0; i < y.length; i++) {

// If a field is empty...
if (y[i].value == "") {
  // add an "invalid" class to the field:
  y[i].className += "form-control invalid border";
  console.log(y[i])
  // and set the current valid status to false
  valid = false;
}
}
// If the valid status is true, mark the step as finished and valid:
if (valid) {
document.getElementsByClassName("step")[currentTab].className += " finish";
}
return valid; // return the valid status
}

function fixStepIndicator(n) {
// This function removes the "active" class of all steps...
var i, x = document.getElementsByClassName("step");
for (i = 0; i < x.length; i++) {
x[i].className = x[i].className.replace(" active", "");
}
//... and adds the "active" class on the current step:
x[n].className += " active";
}
 

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
