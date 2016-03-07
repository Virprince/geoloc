"use srtric";

//VARIABLES
var data;
var locArray = new Array();
var geoLoc = new Array();
var userGeoLocConfirm = 'La géolocalisation vous positionne à cet endroit.<br/> Est-ce correct ? <button class="geo-loc-ok">Oui</button> <button class="geo-loc-no">Non</button>';
var userGeoLocLat;
var userGeoLocLong;

//////////////////////
//GENERATION LISTE DOM
//////////////////////
	function createList(ostreiculteur){

        //création div globale
        var div = document.createElement('div');
            div.classList.add('ostreiculteur')
        //ajouter a body
        document.body.appendChild(div);

            //Nom de l'entreprise
            var entreprise = document.createElement('h2');
            entreprise.textContent = ostreiculteur.entreprise;

            //Nom
            var prenomNom = document.createElement('p');
            prenomNom.textContent = ostreiculteur.prenom + " " + ostreiculteur.nom ;
            
            //Adresse
            var adresseFull = document.createElement('p');
            adresseFull.textContent = ostreiculteur.adresse + " " + ostreiculteur.codePostal + " " + ostreiculteur.ville ;
            
            //Coordonnées
            var coordonnees = document.createElement('p');
            coordonnees.textContent = ostreiculteur.latitude + " , " + ostreiculteur.longitude ;

            //Description
            var description = document.createElement('p');
            description.textContent = ostreiculteur.description ;

        //Ajout des éléments
            div.appendChild(entreprise);
            div.appendChild(prenomNom);
            div.appendChild(adresseFull);
            div.appendChild(coordonnees);
            div.appendChild(description);
    }
//////////////////////
//GENERATION LOCATION
//////////////////////
    function createLocation(ostreiculteur){
        var entreprise = ostreiculteur.entreprise;
        var latitude = ostreiculteur.latitude;
        var longitude = ostreiculteur.longitude;

        //console.log(typeof entreprise);
        //console.log(typeof latitude);

        var objLoc = new Array(entreprise, latitude, longitude);
        //console.log(objLoc);
        locArray.push(objLoc);
    }
//////////////////////
//GENERATION GEOLOC
//////////////////////
	function userGeoloc(position) {
      var infopos = "Position déterminée :\n";
      infopos += "Latitude : "+position.coords.latitude +"\n";
      infopos += "Longitude: "+position.coords.longitude+"\n";
      infopos += "Altitude : "+position.coords.altitude +"\n";
      document.getElementById("infoposition").innerHTML = infopos;
      
      userGeoLocLat = position.coords.latitude;
      userGeoLocLong = position.coords.longitude;

      console.log('geolocready',userGeoLocLat);
      console.log('geolocready',userGeoLocLong);

      geoLoc.push(userGeoLocConfirm , userGeoLocLat , userGeoLocLong );
      console.log('attention1', geoLoc)

      //on affiche la map
        initialize();
      
    }
//////////////////////
//GENERATION MAP
//////////////////////
	function initialize(){
        //var image = 'img/map-marker.png';
        var mapOptions = {
            zoom: 8,
            zoomControl : true,
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: true,
            draggable: true,
            zoomControlOpt: {
              style : 'SMALL',
              position: 'TOP_LEFT'
            },
            panControl : false,
            center: new google.maps.LatLng(45.740693, -0.675659),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        //on ajoute les markers
        //assigner array qui regroupe les infos
        var locations = locArray;
        var infowindow = new google.maps.InfoWindow();
        var marker, i;

	    for (i = 0; i < locations.length; i++) {  
	      marker = new google.maps.Marker({
	        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
	        map: map
	        //icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
	      });

	    google.maps.event.addListener(marker, 'click', (function(marker, i) {
	        return function() {
	          infowindow.setContent(locations[i][0]);
	          infowindow.open(map, marker);
	        }
	      })(marker, i));
	    }
	    // marker geolocalisation
	    var userGeoLoc = geoLoc;

	    var markerGeoloc = new google.maps.Marker({
	        position: new google.maps.LatLng(geoLoc[1],geoLoc[2]),
	        map: map,
	        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
	    }) ;
	    google.maps.event.addListener(markerGeoloc, 'click', (function(markerGeoloc) {
	        return function() {
	          infowindow.setContent(geoLoc[0]);
	          infowindow.open(map, markerGeoloc);
	        }
	      })(markerGeoloc));
		                
    }



//////////////////////////////////////////////////////////CODE

document.addEventListener('DOMContentLoaded', function(){
	//On charge le json
    var tweetsP = fetch('/xml-beta/data/data.json')
        .then(function(resp){return resp.json()})
        .then(function(r){
                    //var data = r ;
                    //console.log(r)
                    var fichier = r;
                    data = fichier;

                    //Générer les listes dans le DOM
                        data.forEach (function(e){
                            var div = createList(e);
                        });

                    //Générer Array pour location gmap
                        data.forEach (function(e){
                            var loc = createLocation(e);
                        });

            //GEOLOCALISATION
            		if(navigator.geolocation) {
                    // L'API est disponible
                    	//on récupère les coordonnées.
                        navigator.geolocation.getCurrentPosition(userGeoloc);

                    } else {
                      // Pas de support, utiliser une adresse donnée
                      initialize();

                    }


           })//END
})

