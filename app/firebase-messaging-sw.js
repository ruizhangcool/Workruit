importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');


var config = {
  apiKey: "AIzaSyAXQhrkpagbroAzfnGu0Kz_jvxVqVYAfIU",
  authDomain: "workruit-f6542.firebaseapp.com",
  databaseURL: "https://workruit-f6542.firebaseio.com",
  projectId: "workruit-f6542",
  storageBucket: "workruit-f6542.appspot.com",
  messagingSenderId: "359675688873"
};
var appConfigObject = firebase.initializeApp(config);
console.log(appConfigObject);

// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    icon: '/images/Logo-Green.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
