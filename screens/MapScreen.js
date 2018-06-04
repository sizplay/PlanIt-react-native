import React, {Component} from 'react';
import { View, Text } from 'react-native';
import { Header, Left, Button, Icon, Body, Title, Subtitle,   Right, Fab } from 'native-base';
import { MapView } from 'expo';
import { Provider } from 'react-redux';
import store from '../store';
import call from '../store/axiosFunc';

const mapStyle = [
  {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#444444"
          }
      ]
  },
  {
      "featureType": "administrative.neighborhood",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "off"
          },
          {
              "hue": "#ff0000"
          }
      ]
  },
  {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "off"
          },
          {
              "weight": "1.24"
          },
          {
              "hue": "#ff0000"
          }
      ]
  },
  {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "visibility": "off"
          },
          {
              "color": "#1a0a0a"
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
          {
              "color": "#f2f2f2"
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "labels",
      "stylers": [
          {
              "saturation": "7"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#e0e0e0"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "visibility": "off"
          },
          {
              "color": "#040303"
          },
          {
              "weight": "5.56"
          },
          {
              "lightness": "-3"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "labels",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#f6f6f6"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#fa0404"
          }
      ]
  },
  {
      "featureType": "landscape.natural.landcover",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#fd0000"
          }
      ]
  },
  {
      "featureType": "landscape.natural.landcover",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "weight": "1.22"
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.attraction",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "saturation": "61"
          },
          {
              "lightness": "-63"
          },
          {
              "gamma": "1.52"
          }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.school",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.school",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "off"
          },
          {
              "hue": "#ffbf00"
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
          {
              "saturation": -100
          },
          {
              "lightness": 45
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "hue": "#ff0000"
          },
          {
              "lightness": "43"
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#000000"
          },
          {
              "weight": "0.01"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "weight": "2"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "weight": "2.08"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "lightness": "0"
          },
          {
              "gamma": ".75"
          }
      ]
  },
  {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
          {
              "color": "#2381a8"
          },
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#00e4ff"
          },
          {
              "saturation": "-32"
          },
          {
              "lightness": "59"
          },
          {
              "weight": "0.68"
          }
      ]
  }
];

export default class MapScreen extends Component {
  static navigationOptions = {
    // not working on drawer
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => (
        <Ionicons name="md-home" size={25} color={tintColor} />
    ),
  };
  constructor() {
    super();
    this.state = {
      location: {
        latitude: 40.7050758,
        longitude: -74.00916039999998,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    };
  }
  componentDidMount(){
      call('get', 'api/user/plan')
        .then(res => res.data)
        .then(plan => console.log(plan))
        .catch(err => console.log(err))
  }

  renderMap() {
    const { location } = this.state;
    return (
    <View style={{flex: 1}}>
        <MapView
        style={{flex: 1}}
        initialRegion={location}
        provider={MapView.PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        />
        <Fab
        direction='up'
        position="bottomRight"
        style={{backgroundColor: '#FF6D00'}}
        >
            <Icon name="add" />
        </Fab>
    </View>
    )
  }

  render() {
    const { renderMap } = this;
    return (
        <Provider store={store}>
            {this.renderMap()}
        </Provider>
    );
  }
}

