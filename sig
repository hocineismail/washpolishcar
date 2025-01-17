<% include ../_header %> 
   
   <title>انشاء حساب جديد </title>
</head>


<body>
  <nav class="navbar navbar-expand-lg  navbar-light" style="color: #fff; background-color: #0075C2">
    <div class="container">
      <a class="navbar-brand" href="/" style="color: #fff; " id="logo">Wash Polish Car</a>
      <a class="nav-link" href="/" style="color: #fff; ">الصفحة الرئيسية </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
        aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav mr-auto" dir="ltr">

        </ul>
        <form class="form-inline">
          <button class="btn btn-outline-success" onclick="window.location.href='/login'" id="signin"
            type="button">تسجيل الدخول</button>

        </form>
      </div>
    </div>
  </nav>
  <div class="container">
    <h3 style="padding: 50px; text-align: center"> انشاء حساب جديد</h3>
    <div class="row">
      <div class="col-md-5">
        <form  method="post" action="/signup">
          <div class="form-group">
            <label for="exampleInputEmail1">الاسم</label>
            <input type="text" name="Firstname" class="form-control" id="Firstname" aria-describedby="Firstname" placeholder="الاسم ">
         </div>

          <div class="form-group">
            <label for="exampleInputEmail1">اللقب</label>
            <input type="text" name="Lastname" class="form-control" id="Lastname" aria-describedby="Lastname" placeholder="اللقب ">
         </div>


         <div class="form-group">
          <label for="exampleInputEmail1">البريد الإلكتروني</label>
          <input type="email"  name="email" class="form-control" id="Email" aria-describedby="Email" placeholder="البريد الإلكتروني">
          <small id="emailHelp" class="form-text text-muted">لن نشارك بريدك الإلكتروني مع أي شخص آخر.</small>
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">اسم مستخدم</label>
          <input type="text"  name="username" class="form-control" id="username" aria-describedby="username" placeholder="اسم مستخدم<">
        
        </div>

          <div class="form-group">
            <label for="exampleInputEmail1">البلد</label>
            <input type="text" name="Country" class="form-control" id="Country" aria-describedby="Country" placeholder="السعودية" disabled>
          </div>

          <div class="form-group">
            <label for="exampleInputEmail1">المنطقة</label>
            <input type="text" name="City" class="form-control" id="City" aria-describedby="City" placeholder="المنطقة">
          </div>

          <div class="form-group">
            <label for="Address">العنوان</label>
            <input type="text"  name="Address" class="form-control" id="Address" aria-describedby="Address" placeholder="العنوان">
          </div>

          <div class="form-group">
            <label for="Phone">رقم الجوال</label>
            <input type="number" name="Phone" class="form-control" id="Phone" aria-describedby="Phone" placeholder="رقم الجوال">
          </div>

          <div class="form-group">
            <label for="exampleInputPassword1">كلمد المرور</label>
            <input type="password" name="Password" class="form-control" id="password" placeholder="كلمة المرور">
          </div>

          <div class="form-group">
            <input class="form-control" style="text-align: right"  type="password" placeholder="اعادة كتابة كلمة المرور" id="confirm_password" required>
            <i class="fa fa-key icon"></i>  
           </div>

          <div class="form-check">
          
         </div>
         
        
      </div>
      <div class="col-md-7">
          <h5  style="text-align: center" >الاحداثيات</h5>
     <div class="form-inline"> 
     
        <div class="form-group mx-sm-3 mb-2">
          <label for="inputPassword2" class="sr-only">خط العرض</label>
          <input type="number"  name="PositionLatitude" class="form-control"  id="number" placeholder="خط العرض" value="152" >
        </div>
        <div class="form-group mx-sm-3 mb-2">
         <label for="inputPassword2" class="sr-only">خط الطول</label>
         <input type="number" name="PositionLongitude" class="form-control"  id="number" placeholder="خط الطول" value="125" >
        </div>
     </div>
      </div>
    </div>
</div>
<button type="submit" class="btn btn-primary form-check-label"> انشاء حساب جديد</button>
</form>
      </div>
      <div class="col-md-7">
        
       

        <!-- set google maps here -->
        <input id="pac-input" class="controls" type="text" placeholder="Search Box">
        <div id="map" style="height: 50%;"></div>

        <script>
          function initAutocomplete() {
            var map = new google.maps.Map(document.getElementById('map'), {
              center: { lat: -33.8688, lng: 151.2195 },
              zoom: 13,
              mapTypeId: 'roadmap'
            });

            // Create the search box and link it to the UI element(the input).
            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function () {
              searchBox.setBounds(map.getBounds());
            });

            var markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function () {
              var places = searchBox.getPlaces();

              if (places.length == 0) {
                return;
              }

              // Clear out the old markers.
              markers.forEach(function (marker) {
                marker.setMap(null);
              });
              markers = [];

              // For each place, get the icon, name and location.
              var bounds = new google.maps.LatLngBounds();
              places.forEach(function (place) {
                if (!place.geometry) {
                  console.log("Returned place contains no geometry");
                  return;
                }
                //set coordonates to inputs
                document.getElementById("numberLat").value = place.geometry.location.lat().toString();
                document.getElementById("numberLng").value = place.geometry.location.lng().toString();
                var icon = {
                  url: place.icon,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                  map: map,
                  icon: icon,
                  title: place.name,
                  position: place.geometry.location,
                  draggable: false
                }));

                if (place.geometry.viewport) {
                  // Only geocodes have viewport.
                  bounds.union(place.geometry.viewport);
                } else {
                  bounds.extend(place.geometry.location);
                }
              });
              map.fitBounds(bounds);
            });
            google.maps.event.addListener(map, 'click', function (event) {
              // Clear out the old markers.
              markers.forEach(function (marker) {
                marker.setMap(null);
              });
              markers = [];
              document.getElementById("numberLat").value = event.latLng.lat().toString();
              document.getElementById("numberLng").value = event.latLng.lng().toString();

              markers.push(new google.maps.Marker({
                map: map,
                position: event.latLng,
                draggable: false
              }));
            });

            // geolocation.
            var infoWindow = new google.maps.InfoWindow;

            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('موقعك');
                infoWindow.open(map);
                map.setCenter(pos);
              },
                function () {
                  handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
              // Browser doesn't support Geolocation
              handleLocationError(false, infoWindow, map.getCenter());
            }
          }

          function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
              'Error: The Geolocation service failed.' :
              'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
          }

        </script>

      </div>
    </div>
  </div>
  </div>


  <!--set Script here-->

  <script src="https://maps.googleapis.com/maps/api/js?key=&libraries=places&callback=initAutocomplete"
    asyncdefer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.22/vue.js"></script>
  <script src="vue/vue.js"></script>

  <script type="text/javascript">
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
  </script>
  <% include ../_footer %>

