var uiConfig = {
  signInSuccessUrl: 'registration.html',
  signInFlow: 'popup',

  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // tosUrl: '<your-tos-url>',
  // privacyPolicyUrl: function() {
  //   window.location.assign('<your-privacy-policy-url>');
  // }
};

function addForm() {

  Formio.createForm(document.getElementById('formio'), {
    components: [
      {
        type: 'textfield',
        key: 'parentsName',
        label: 'Parents Name',
        placeholder: 'Enter your full name.',
        input: true
      },
      {
        type: 'email',
        key: 'emailAddress',
        label: 'Parents Email',
        placeholder: 'Enter your email address',
        input: true
      },
      {
        type: 'phoneNumber',
        key: 'phoneNumber',
        label: 'Parents Contact Number',
        inputMask: '99999-999999',
        placeholder: 'Enter your contact number',
        input: true
      },
      {
        type: 'textfield',
        key: 'homeNumber',
        label: 'House Number or Name',
        placeholder: 'Enter your house name of number',
        input: true
      },
      {
        type: 'address',
        key: 'homeAddress',
        label: 'Home Address',
        placeholder: 'Enter your home address (Start with your postcode)',
        map: {
          key: 'AIzaSyAbekTOJL56Gz-zDkJ9a3Su2Qxo_uD7urI'
        },
        input: true
      },
      {
        type: 'radio',
        key: 'coach',
        label: 'Are you a coach and will be going?',
        values: [{label: 'Yes', value: 'Y'}, {label: 'No', value: 'N'}, {label: 'Potentially', value: '?'}],
        input: true
      },

      {
        type: 'radio',
        key: 'sponsorship',
        label: 'Are you able to sponsor the event?',
        values: [{label: 'Yes', value: 'Y'}, {label: 'No', value: 'N'}, {label: 'Potentially', value: '?'}],
        input: true
      },
      {
        label: 'Children',
        key: 'children',
        type: 'datagrid',
        input: true,
        validate: {
          minLength: 1,
          maxLength: 6
        },
        components: [
          {
            label: 'First Name',
            key: 'firstName',
            type: 'textfield',
            input: true
          },
          {
            label: 'Last Name',
            key: 'lastName',
            type: 'textfield',
            input: true
          },
          {
            label: 'Gender',
            key: 'gender',
            type: 'select',
            input: true,
            data: {
              values: [
                {
                  value: 'M',
                  label: 'Boy'
                },
                {
                  value: 'F',
                  label: 'Girl'
                }
              ]
            },
            dataSrc: 'values',
            template: '<span>{{ item.label }}</span>'
          },
          {
            label: 'Birthdate',
            key: 'birthdate',
            type: 'datetime',
            input: true,
            placeholder: '',
            format: 'yyyy-MM-dd',
            enableDate: true,
            enableTime: false,
            defaultDate: '',
            datepickerMode: 'day',
            datePicker: {
              showWeeks: true,
              startingDay: 0,
              initDate: '',
              minMode: 'day',
              maxMode: 'year',
              yearRows: 4,
              yearColumns: 5,
              datepickerMode: 'day',
              minDate: "2006-01-01",
              maxDate: "2014-12-31"
            }
          },
          {
            label: 'Age Group 2018/2019 Season',
            key: 'ageGroup',
            type: 'select',
            input: true,
            data: {
              values: [
                {
                  value: 'U8',
                  label: 'U8'
                },
                {
                  value: 'U9',
                  label: 'U9'
                },
                {
                  value: 'U10',
                  label: 'U10'
                },
                {
                  value: 'U11',
                  label: 'U11'
                },
                {
                  value: 'U12',
                  label: 'U12'
                },
              ]
            }
          },
          {
            label: 'Shirt Size',
            key: 'shirtSize',
            type: 'select',
            input: true,
            data: {
              values: [
                {
                  value: 'SB',
                  label: 'SB'
                },
                {
                  value: 'MB',
                  label: 'MB'
                },
                {
                  value: '6',
                  label: '8'
                },
                {
                  value: '10',
                  label: '10'
                },
                {
                  value: '12',
                  label: '12'
                },
                {
                  value: '14',
                  label: '14'
                },
              ]
            }
          }
        ]
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Continue to Checkout',
        theme: 'primary'
      }
    ]
  }).then(function (form) {
    form.on('submit', function (submission) {
      form.readOnly();

      firebase.database().ref('/registrations/' + firebase.auth().currentUser.uid).set({
          parent_address: submission.data.homeAddress.formatted_address,
          parent_name: submission.data.parentsName,
          sponsorship: submission.data.sponsorship,
          coach: submission.data.coach,
          email: submission.data.emailAddress,
          children: submission.data.children
        }, function (error) {
          if (error) {
            console.log(error);
          } else {
            console.log("Written Successfully")
          }
        }
      );
    })
  })
};


document.addEventListener('DOMContentLoaded', function () {
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// // The Firebase SDK is initialized and available here!
//
  firebase.auth().onAuthStateChanged(user => {
  if (user) {
    if (! firebase.database().ref('/registrations/' + user.uid)) {
      document.getElementById("registration").style.visibility = 'visible';
      addForm();
    } else {
      document.getElementById("registered").style.visibility = 'visible';
    }
  } else {

  }
  });

  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');

  } catch (e) {
    console.error(e);
    document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
  }
});
var ui = new firebaseui.auth.AuthUI(firebase.auth());
if (ui.isPendingRedirect()) {
  // Initialize the FirebaseUI Widget using Firebase.
  ui.disableAutoSignIn();
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);
}