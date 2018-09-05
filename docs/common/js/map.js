(function () {
	"use strict";

	var map = L.map('map').setView([35.784633, 139.899682], 17);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		maxZoom: 20,
		maxNativeZoom: 18
	}).addTo(map);

	//marker popup
	function onEachFeature(feature, layer) {
		var name, phone, website
		if (feature.properties["name"]) {
			name = feature.properties["name"]
		}

		if (feature.properties["phone"] == null) {
			phone = '';
		} else {
			phone = feature.properties["phone"];
			if (phone.charAt(0) == '+') {
				phone = phone.slice(4);
				phone = '0' + phone
			}
		}
		if (feature.properties["website"] == null) {
			website = ''
		} else {
			website = feature.properties["website"]
		}
		layer.bindPopup(name + '<br>' + phone + '<br>' + '<a href="' + website + '" target="_blank" rel="noopener">' + website + '</a>');
	}

	//marker
	var IconSize = [35, 41],
		ShadowSize = [41, 41],
		ShadowAnchor = [10, 18],
		PopupAnchor = [0, -20],
		ShadowUrl = 'common/css/images/marker-shadow.png',
		IconUrlBase = 'common/img/map-icon/'

	function markerPointToLayer(feature, latlng) {
		switch (true) {
			case (feature.properties["cuisine:ja"] == "フランス料理"):
				return L.marker(latlng, {
					icon: L.icon({
						iconUrl: IconUrlBase + 'restrant.png',
						shadowUrl: ShadowUrl,
						iconSize: IconSize,
						shadowSize: ShadowSize,
						shadowAnchor: ShadowAnchor,
						popupAnchor: PopupAnchor
					})
				});
				break;
			case (feature.properties["cuisine:ja"] == "イタリア料理"):
				return L.marker(latlng, {
					icon: L.icon({
						iconUrl: IconUrlBase + 'italian.png',
						shadowUrl: ShadowUrl,
						iconSize: IconSize,
						shadowSize: ShadowSize,
						shadowAnchor: ShadowAnchor,
						popupAnchor: PopupAnchor
					})
				});
				break;
			case (feature.properties.amenity == "bank"):
				return L.marker(latlng, {
					icon: L.icon({
						iconUrl: IconUrlBase + 'bank.png',
						shadowUrl: ShadowUrl,
						iconSize: IconSize,
						shadowSize: ShadowSize,
						shadowAnchor: ShadowAnchor,
						popupAnchor: PopupAnchor
					})
				});
				break;

		}
	}


	//飲食店
	var frenchLayer = L.geoJson(matsudo, {
		filter: function (feature, layer) {
			if (feature.properties["cuisine:ja"] == "フランス料理") {
				return true;
			}
		},
		onEachFeature: onEachFeature,
		pointToLayer: markerPointToLayer
	}).addTo(map);

	var italianLayer = L.geoJson(matsudo, {
		filter: function (feature, layer) {
			if (feature.properties["cuisine:ja"] == "イタリア料理") {
				return true;
			}
		},
		onEachFeature: onEachFeature,
		pointToLayer: markerPointToLayer
	}).addTo(map);



	//施設
	var bankLayer = L.geoJson(matsudo, {
		filter: function (feature, layer) {
			if (feature.properties.amenity == "bank") {
				return true;
			}
		},
		onEachFeature: onEachFeature,
		pointToLayer: markerPointToLayer
	}).addTo(map);


	//マップコンテナ
	var overlays = [
		{
			groupName: "飲食店",
			expanded: false,
			layers: {
				"フランス料理": frenchLayer,
				"イタリア料理": italianLayer
			}
			},
		{
			groupName: "施設",
			expanded: false,
			layers: {
				"銀行": bankLayer,
			}
		}
				]


	var options = {
		container_maxHeight: "500px",
		collapsed: false,
		exclusive: false,
		position: 'topright'

	};

	var control = L.Control.styledLayerControl('', overlays, options);
	map.addControl(control);

})();
