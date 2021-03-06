/*eslint complexity: ["error", 15]*/
import React, { Component } from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { connect } from 'react-redux';
import GoogleSearch from './GoogleSearch';
import { Container, Content, Header, Left, Text, Footer, FooterTab, Button, Icon, Badge, Thumbnail } from 'native-base';
import MapView from 'react-native-maps';
// import mapStyle from '../mapStyle';  // doesn't show POI

import { fetchPlan, updatePlan, createPlan, deletePlan } from '../store/plans';
import { fetchUser } from '../store/users';

const markerData = [
  {
    name: 'Balthazar',
    lat: 40.7226241814105,
    lng: -73.99817168712616,
    place_id: 'ChIJt7fMLIlZwokRCRtM9bNDg78',
    details: 'Pricey but the raw red meat is great.',
  },
  {
    name: "Grimaldi's Pizza",
    lat: 40.702602314710816,
    lng: -73.99322032928467,
    place_id: 'ChIJgzfayTBawokR9jTsF6hLf40',
    details: 'Homemade mozzarella cheese and beautiful view.',
  },
  {
    name: 'Terri',
    lat: 40.70661306619307,
    lng: -74.00703504681587,
    place_id: 'ChIJzcIh0hdawokR59-X8e5i4bk',
    details: 'Vegan delight.',
  },
];

const LATITUDE = 41.881832;
const LONGITUDE = -87.623177;
const LATITUDEDELTA = 0.0922;
const LONGITUDEDELTA = 0.0421;

class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapLoaded: false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDEDELTA,
        longitudeDelta: LONGITUDEDELTA
      },
      isBroadcasting: this.props.plans.status === 'BROADCASTING',
      markers: this.props.places || [],
    };
  }

  componentDidMount() {
    this.setState({ mapLoaded: true });
    // this.props.user && !this.props.users.id ? this.props.fetchUser() : null;
    !this.props.plan ? this.props.fetchPlan() : null;
    this.props.fetchUser();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.places !== this.state.markers) {
      this.setState({ markers: nextProps.places, isBroadcasting: nextProps.plans.status === 'BROADCASTING' });
    }
  }

  onRegionChange = (region) => {
    this.setState({ region });
  }

  addToRegion = (region) => {
    this.onRegionChange(region);
  }

  addToCity = (val) => {
    this.setState({ city: val });
  }

  toggleBroadcastPlan = () => {
    const isBroadcasting = this.state.isBroadcasting;
    if (!isBroadcasting && !this.props.plans.city && this.props.plans.status === 'NEW') { //when plan exist
      const plan = {
        city: this.state.city,
        lat: this.state.region.latitude,
        lng: this.state.region.longitude,
        id: this.props.plans.id,
        status: 'BROADCASTING'
      };
      this.props.updatePlan(plan);
    } else if (!isBroadcasting) { //no plan
      const plan = {
        category: 'All',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toISOString().split('T')[1].slice(0, 5),
        lat: this.state.region.latitude,
        lng: this.state.region.longitude,
        name: `${this.props.users.username}'s Plan`,
        status: 'BROADCASTING',
        userId: this.props.users.id,
        city: 'New York, NY, USA',
      };
      this.props.createPlan(plan);
    }
    if (isBroadcasting && this.props.plans.status === 'BROADCASTING') {
      this.props.updatePlan({
        status: 'CLOSED',
        id: this.props.plans.id
      });
    }
    this.setState({ isBroadcasting: isBroadcasting });
  }

  addMarker = marker => {
    const markers = [...this.state.markers, marker];
    this.setState({ markers });
  }

  // simulateFriendsRecommending = () => {
  //   if (this.state.isBroadcasting) {
  //     let counter = this.props.places - 1;
  //     const nIntervId = setInterval(() => {
  //       const marker = this.props.places[counter];
  //       this.addMarker(marker);
  //       if (!counter) {
  //         clearInterval(nIntervId);
  //       }
  //       counter--;
  //     }, 1000);
  //   } else {
  //     this.setState({ markers: [] });
  //   }
  // }

  openDrawer = () => {
    this.props.navigation.openDrawer();
  }

  renderMarkers = () => {
    if (!this.state.markers) {
      return;
    }
    return this.state.markers.map(marker => {
      return (
        <MapView.Marker
          key={marker.place_id}
          id={marker.place_id}
          coordinate={{ latitude: marker.lat, longitude: marker.lng }}
          title={marker.name}
          description={marker.details}
        />
      );
    });
  }

  renderHeader = () => {
    return (
      <Header rounded searchBar style={{ backgroundColor: 'tomato' }}>
        <Left>
          <Button
            transparent
            onPress={this.openDrawer}
          >
            <Icon style={{ color: 'white' }} name="menu" />
          </Button>
        </Left>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Image
            style={{ alignSelf: 'center', width: 150, height: 70, marginRight: 100 }}
            source={require('../assets/headerLogo.png')}
          />
        </View>
      </Header>
    );
  }

  renderCallButtonIcon = () => {
    if (!this.state.isBroadcasting) {
      return (
        <Image
          style={{ width: 80, height: 80 }}
          source={require('../assets/broadcast.png')}
        />
      );
    } else {
      return (
        <Image
          style={{ width: 80, height: 80 }}
          source={require('../assets/broadcastX.png')}
        />
      );
    }
  }

  render() {
    const { mapLoaded, region, markers, isBroadcasting } = this.state;
    const { toggleBroadcastPlan, renderHeader, renderScreen, renderCallButtonIcon } = this;
    const { navigation, plansCount, friendsPlans } = this.props;
    if (!mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <Container>
        {renderHeader()}
        <Content contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ flex: 1 }}>
            <GoogleSearch region={this.addToRegion} city={this.addToCity} type="(cities)" />
            <MapView
              style={{ flex: 1 }}
              //initialRegion={region}
              region={region}
              provider={MapView.PROVIDER_GOOGLE}
              //customMapStyle={mapStyle}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton={true}
              showsPointsOfInterest={true}
              showsBuildings={true}
              // onPoiClick={e => console.log(e.nativeEvent)}
              //onRegionChange={regions => this.onRegionChange(regions)}
              onRegionChangeComplete={regions => this.onRegionChange(regions)}
            // onPress={ev => console.log(ev.nativeEvent)}
            >
              {isBroadcasting ? this.renderMarkers() : null}
            </MapView>
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button
              vertical
              onPress={this.navToPlanSettings}
            >
              <Icon name="calendar" />
              <Text style={{ fontSize: 12 }}>Plan Settings</Text>
            </Button>
            <Button vertical>
              <Text />
            </Button>
            <Button badge vertical>
              <Badge style={(isBroadcasting && markers.length ? styles.badgeVisible : styles.badgeInvisible)}><Text>{markers.length}</Text></Badge>
              <Icon type="MaterialCommunityIcons" name="thought-bubble-outline" />
              <Text style={{ fontSize: 12 }}>Suggestions</Text>
            </Button>
          </FooterTab>
        </Footer>
        <View style={styles.friendIcons}>
          <Button transparent onPress={() => navigation.navigate('FriendsPlans')}>
            {plansCount >= 1 ? <Thumbnail circle small source={{ uri: friendsPlans[0] && friendsPlans[0].user && friendsPlans[0].user.thumbnail }} style={{ zIndex: 30 }} /> : null}
            {plansCount >= 2 ? <Thumbnail circle small source={{ uri: friendsPlans[1] && friendsPlans[1].user && friendsPlans[1].user.thumbnail }} style={{ marginLeft: -10, zIndex: 20 }} /> : null}
            {plansCount >= 3 ? <Thumbnail circle small source={{ uri: friendsPlans[2] && friendsPlans[2].user && friendsPlans[2].user.thumbnail }} style={{ marginLeft: -10, zIndex: 10 }} /> : null}
            {plansCount > 3 ?
              <Badge style={{
                marginLeft: -12, marginTop: -12, zIndex: 40,
                transform: [{ scale: 0.7 }]
              }}><Text style={{}}>{plansCount}</Text></Badge>
              : null
            }
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            rounded
            style={styles.planCallButton}
            onPress={toggleBroadcastPlan}
          >
            {renderCallButtonIcon()}
          </Button>
        </View>
        <View style={styles.planDetailPressView}>
          <Button
            style={styles.pressAreaBtn}
            onPress={() => navigation.navigate('PlanDetails')}
          />
        </View>
        <View style={styles.suggestPressView}>
          <Button
            style={styles.pressAreaBtn}
            onPress={() => navigation.navigate('Suggestions')}
          />
        </View>
      </Container>
    );
  }
}

const styles = {
  badgeInvisible: {
    opacity: 0
  },
  badgeVisible: {
    opacity: 1
  },
  friendIcons: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    left: 10,
    bottom: 90,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  planCallButton: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  planCallIcon: {
    paddingLeft: 10,
    fontSize: 36,
  },
  planDetailPressView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  suggestPressView: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  pressAreaBtn: {
    width: 100,
    height: 55,
    opacity: 0,
    backgroundColor: '#A8A8A8',
    borderRadius: 0,
  },
};

const mapStateToProps = ({ plans, users, friendsPlans }) => {
  friendsPlans = friendsPlans.filter(plan => plan.status === 'BROADCASTING');
  const plansCount = friendsPlans.length;
  const places = plans.places || [];
  return {
    users,
    plans,
    places,
    friendsPlans,
    plansCount
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: () => dispatch(fetchUser()),
    fetchPlan: () => dispatch(fetchPlan()),
    updatePlan: (plan) => dispatch(updatePlan(plan)),
    createPlan: (plan) => dispatch(createPlan(plan)),
    deletePlan: () => dispatch(deletePlan())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
