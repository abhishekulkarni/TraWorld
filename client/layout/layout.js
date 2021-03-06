Template.layout.helpers({
  userName: function() {
      const liveUser = Meteor.userId();
      return Meteor.users.findOne({
          _id: liveUser
      });
  },
  proexist:function(){
    var userpro=UserFavorites.findOne({user:Meteor.userId()});
    if(userpro&&userpro.propic){
      return true;
    }else{
      return false;
    }
  },
  propicbar:function(){
    var user=UserFavorites.findOne({user:Meteor.userId()});
    if(user&&user.propic){
      return YourFileCollection.findOne({_id:user&&user.propic});
    }
  }
})
Template.layout.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('/');
    },
    "click .js-goto": function(event){
          console.log("clicked it");
          // $(".js-speak").html("Listening...");
       // https://shapeshed.com/html5-speech-recognition-api/
          const recognition = new webkitSpeechRecognition();
          recognition.lang = 'en-US'
          recognition.onresult = function(event) {
              console.dir(event);
              // $(".js-speak").html("Got it!");
               Session.set("searchit",event.results[0][0].transcript);
              // $(".js-loca").val(Session.get("searchit"));
             send();

    //        execute(Session.get("transcript"));
            };
            // $(".js-loca").val("");
        recognition.start();
       //      console.log("starting the recognizer")


       },

});
function send() {
  // $speechInput,
  //   $recBtn,
  //   recognition,
  //   messageRecording = "Recording...",
  //   messageCouldntHear = "I couldn't hear you, could you say that again?",
  //   messageInternalError = "Oh no, there has been an internal server error",
  //   messageSorry = "I'm sorry, I don't have the answer to that yet.";
  var text =  Session.get("searchit");
  var baseUrl= "https://api.api.ai/v1/";
  var subscriptionKey="";
  var synth=window.speechSynthesis;
  $.ajax({
    type: "POST",
    url: baseUrl + "query/",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      "Authorization": "Bearer " + "8c154d0fc086495daec6c8b12a5b7af8",
      "ocp-apim-subscription-key": subscriptionKey
    },
    // data: JSON.stringify({ q: text, lang: "en" }),
    // success: function(data) {
    //   console.dir(data);
    //
    //     //  setResponse(JSON.stringify(data, undefined, 2));
    //     //  r= JSON.parse(results);
    //     //  console.dir(data.result.speech);
    //   setResponse(data.result.speech);
    //   var utterThis = new SpeechSynthesisUtterance(data.result.speech);
    // //  "ocp-apim-subscription-key": subscriptionKey
    // },
    data: JSON.stringify({ q: text, lang: "en" }),
    success: function(data) {
      //setResponse(JSON.stringify(data, undefined, 2));
        //  r= JSON.parse(results);
        //  console.dir(data.result.speech);
      console.dir(data)
      var goPage = data.result.parameters;
      console.log(goPage);
      setResponse(data.result.speech);

      var utterThis = new SpeechSynthesisUtterance(data.result.speech);
      voices = synth.getVoices();
      utterThis.voice = voices[0]; //61-82    61,64, 66, 67,  74 is top, 80, 22 weird singing
      synth.speak(utterThis);

      if((!goPage.groupCamp)&&(!goPage.maps)&&(!goPage.pastItineraries)){
        Router.go('/');
      }
      else if((!goPage.home)&&(!goPage.maps)&&(!goPage.pastItineraries)){
        Router.go('groupCampSearch');
      }
      else if((!goPage.home)&&(!goPage.groupCamp)&&(!goPage.pastItineraries)){
        Router.go('map');
      }
      else if((!goPage.home)&&(!goPage.groupCamp)&&(!goPage.maps)){
        Router.go('pastitin');
      }
      else{

      }


    },
    error: function() {
      setResponse("Internal Server Error");
    }
  });
    setResponse("Loading...");
}

function setResponse(val) {
  $("#response").text(val);
}
 /*
  **********************************************************
  * OPAQUE NAVBAR SCRIPT
  **********************************************************
  */

  // Toggle tranparent navbar when the user scrolls the page

  $(window).scroll(function() {
    if($(this).scrollTop() > 50)  /*height in pixels when the navbar becomes non opaque*/
    {
        $('.opaque-navbar').addClass('opaque');
    } else {
        $('.opaque-navbar').removeClass('opaque');
    }
});
