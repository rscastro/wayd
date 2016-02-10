const React = require('react-native');
const MK = require('react-native-material-kit')
const Separator = require('./helpers/separator.js')
const Error = require('./Error')
const Success = require('./Success')
const Contacts = require('react-native-contacts')
<<<<<<< 7eefc1f41791a6968293c8fc8b4b5dfcc459e4d2
const host = !process.env.DEPLOYED ? 'http://104.236.40.104/' : 'http://localhost:3000/'
var { Icon } = require('react-native-icons');
=======
const host = process.env.DEPLOYED ? 'http://104.236.40.104/' : 'http://localhost:3000/'
>>>>>>> added another api request to retriever event cateogry, built category hash for mapping images to events, changed email tempplates

const {
  StyleSheet,
  ListView,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  View,
  ScrollView,
  Modal
} = React


const {
  MKButton,
  MKColor,
  mdl,
  MKTextField,
} = MK;

MK.setTheme({
  primaryColor: MKColor.Amber,
  accentColor: MKColor.Orange,
});

const Email = React.createClass({

  componentDidMount: function() { 
   this.setState({email: ''});
  },

  componentWillMount: function() {
    Contacts.getAll((err, contacts) => {
      if(err && err.type === 'permissionDenied'){
        console.log("No contacts")
      } else {
        this.props.addContacts(contacts);
      }
    });
  },

  getInitialState: function() {
    return {
      animated: true,
      visible: false,
      transparent: false
    }
  },

  addEmail: function() {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    console.log('re', re)
    var currentEmail = this.state.email

    if (currentEmail && re.test(currentEmail) ) {

    var email = this.state.email;
    console.log('email getting dispatched is...', email)
    this.props.addEmail(email);
    
    } else {
      console.log('invalid email')
    }
  },

  addContactEmail: function(contactEmail){
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      console.log('re', re);
    var currentEmail = contactEmail;

    if (currentEmail && re.test(currentEmail) ) {
      var email = contactEmail;
      console.log('email getting dispatched is...', email)
      this.props.addEmail(email);
    } else {
      console.log('invalid email');
    }
  },



  sendPoll: function() {
    if (this.props.emails.length) {

      console.log("sending event:", this.props.currentEvent);
      this.props.loadingPoll(true);

      fetch(host + 'api/polls', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollInfo: {
            emails: this.props.emails.concat([this.props.user_email]),

            //Note tha the userId is hardcoded until Auth gets implemted!!
            user: {
              userId: this.props.user_id,
              userFirstName: this.props.user_first_name,
              userLastName: this.props.user_last_name
            },
          },
          eventInfo: this.props.currentEvent,
        })
      })
      .then(function(res) {
        console.log("Got a response!", res);
        this.props.loadingPoll(false);
        this.props.navigator.push({
        title: 'Success',
        component: Success
        });
      }.bind(this))
      .catch(function(err){
        this.props.loadingPoll(false)
        console.log("got an err!", err);
        this.props.navigator.push({
        title: 'Error',
        component: Error
        });
      })

    }

  },

  contactsView: function(){
    this.setState({visible: true});
  },

  closeContactsView: function(){
    this.setState({visible: false});
  },
  
  render: function() {
    console.log('email component render.. props are', this)
    console.log('props are', this);

    var that = this;
    switch (this.props.loading) {
      
      case false:

        var emails = this.props.emails;
        console.log('email arr', emails);
        var allContacts = this.props.contacts;
        var prevLastName = " ";
        var currLastName = " ";

        var contactList = allContacts.map(function (contact, index) {
          prevLastName  = currLastName;
          currLastName = contact.familyName || contact.givenName;
          var letterBar;
          if (prevLastName.charAt(0) !== currLastName.charAt(0)){
            letterBar = (<Text style={styles.letterText}>{currLastName.charAt(0)}</Text>)
          } else {
            letterBar = null;
          }
          if (contact.emailAddresses.length > 0){
            return (
              <View key={index}>
              {letterBar}
              <TouchableHighlight style={styles.button} 
                  key={index}
                  onPress= {function(){
                    if (contact.emailAddresses.length > 0){
                      that.addContactEmail(contact.emailAddresses[0].email);
                      that.closeContactsView();
                    }
                  }}>
                  <Text style={styles.buttonText}>{contact.givenName} {contact.familyName}</Text>
                </TouchableHighlight>
                </View>
            )
          }
        });
        var list = emails.map(function(email, index) {
        return (
            <View style={styles.btnContainer} key={index} >
                
                <View  style={styles.emailItem}>

                  <Text style={styles.bodytext}>{email}</Text>

                  <TouchableHighlight key={index} 
                    style={styles.delBtn}

                    onPress = {function() {
                      var child = this.children.props.children
                      console.log('delete email',this.children.key)
                      that.props.delEmail(this.children.key)
                    }}

                    underlayColor = "tranparent">

                    <Icon key={index}
                      name='material|close-circle-o'
                      size={20}
                      color='#B6B6B6'
                      style={styles.close}
                    />
          


                  </TouchableHighlight>
      
                </View>
              <Separator/>
              </View>
            )
        });

      
        return (
          <View style={styles.Container}>
            <View style = {styles.mainContainer}>
              <View style={styles.topSection}>
              <TouchableHighlight
                style={styles.smallButton}
                onPress = {this.contactsView}
                underlayColor = "#FFC107">
                <Icon
                      name='material|accounts-add'
                      size={30}
                      color='#B6B6B6'
                      style={styles.addFromContacts}
                    />
              </TouchableHighlight>
              
            

             <TextEmail 
             onChangeText={(text) => this.setState({email:text})}/>

              <TouchableHighlight
                style={styles.button}
                onPress = {this.addEmail}
                underlayColor = "#FFC107">
                <Text style={styles.buttonText}> Add Email </Text> 
              </TouchableHighlight>

              </View>

              <ScrollView style={styles.middleSection}  
              onScroll={() => { console.log('onScroll!'); }}>
                {list.length > 0 ? list : <View></View>}
              </ScrollView>
           
            </View>
            <View style={styles.bottomSection}>
            <TouchableHighlight
                style={styles.button}
                onPress = {this.sendPoll}
                underlayColor = "#FFC107">
                <Text style={styles.buttonText}>Send to Friends!</Text> 
              </TouchableHighlight>
            </View>
            <View>
            <Modal
            animated={this.state.animated}
            transparent={this.state.transparent}
            visible={this.state.visible}>
            <View style={styles.modalContainer}>
            <ScrollView style={styles.bottomSection}
            onScroll={() => { console.log('onScroll!'); }}>
              {contactList.length > 0 ? contactList : <View></View>}
            </ScrollView>
              <TouchableHighlight
                style={styles.button}
                onPress = {this.closeContactsView}
                underlayColor = "#FFC107">
                <Text style={styles.buttonText}>Close contacts</Text> 
              </TouchableHighlight>
              </View>
            </Modal>
            </View>
          </View>
          )

      case true:
        console.log('throwing up loading screen');
        return (
          <View style= {styles.spinnerContainer}>
              <Text style={styles.title}> Sending emails... </Text>
              <SingleColorSpinner/>
          </View>
          )

      default:
        console.log("oops");
        return <Text style={styles.title}> Error... </Text>;
    }

  }

})


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 30,
    marginTop: 55,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  modalContainer: {
    flex: 1,
    padding: 10,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  Container: {
    flex: 1,
    padding: 0
  },
  addFromContacts: {
    flex: 1,
    borderRadius: 25
  },
  letterText: {
    fontSize: 15,
    paddingTop: 10,
    color: 'black',
    fontFamily: 'HelveticaNeue-Medium',
    alignSelf: 'center'

  },
   smallButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    flexDirection: 'row',
    backgroundColor: '#673AB7',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
buttonText: {
    fontSize: 15,
    paddingTop: 10,
    color: '#FFFFFF',
    fontFamily: 'HelveticaNeue-Medium',
    alignSelf: 'center'
  },
  button: {
    marginRight: 30,
    marginLeft: 30,
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#673AB7',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  textfield: {
    height: 28,  // have to do it on iOS
    marginTop: 22,
  }, 
  bodytext: {
    marginBottom: 10,
    marginTop: 10,
    fontSize: 15,
    textAlign: 'center',
    color: '#607D8B',
    flex: .8
  },
  emailItem: {
    flexDirection: 'row',
  },
  btnContainer: {
    height: 40,
    marginTop: 10,
    marginBottom: 10,
  },
  fakeBtn: {
    backgroundColor: '#ECEFF1',
    color: 'white',
    height: 40
  },
  topSection: {
    flex: .3
  },
  middleSection: {
    flex: .5
  },
  bottomSection: {
    flex: .2
  },
<<<<<<< 54f4717f69e88671d8e5d0847316cfbeef26aa56
  contacts: {

  },
  close: {
    height: 20,
    width: 20,
    flex: 1
  }
=======
    fab: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
>>>>>>> started code cleanup

});

const TextEmail = MKTextField.textfield()
  .withPlaceholder('email...')
  .withStyle(styles.textfield)
  .build();

const SingleColorSpinner = mdl.Spinner.singleColorSpinner()
  .withStyle(styles.spinner)
  .build();


module.exports = Email
