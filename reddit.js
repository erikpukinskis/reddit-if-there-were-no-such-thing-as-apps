var library = require("module-library")(require)

// The Reddit Everyone Deserves Dang It

library.define(
  "people",
  function() {
    var people = {}
    var seen = {}
    function identify(person) {
      people[person.peopleId] = person
      delete seen[person.peopleId]
    }

    function see(peopleId) {
      if (people[peopleId]) {
        return
      }
      seen[peopleId] = peopleId
    }

    function remember(peopleId) {
      return seen[peopleId] || people[peopleId]
    }

    people.identify = identify
    people.see = see
    people.remember = remember

    return people
  })

library.using(
  ["web-site", "browser-bridge", "web-element", "add-html", "crypto", "make-request", "a-wild-universe-appeared", "people"],
  function(WebSite, BrowserBridge, element, addHtml, crypto, makeRequest, aWildUniverseAppeared, people) {

    var baseBridge = new BrowserBridge()
    var site = new WebSite()
    var universe = aWildUniverseAppeared("treddi", {
      "people": people
    })
    universe.persistToDisk()
    universe.load()

    var redirectUri = "http://localhost:3317/"

    var encodedRedirectUri = encodeURIComponent(
      redirectUri)

    function rando(callback) {
      crypto.randomBytes(
        32,
        function(error, buffer) {
          if (error) throw error
          callback(buffer.toString(
            'hex'))})}

    site.addRoute(
      "get",
      "/treddi.gif",
      site.sendFile(
        __dirname,
        "treddi.gif"))


    var positionOfIcon = {
      "alien": [14,14],
      "logotype": [105,25],
      "choice": [260, 23],
      "pencil": [677,29],
      "search": [755,32],
      "hamburger": [840,29],
      "rocket": [23,160],
      "lil-choice": [168,160],
      "escape": [152,360],
      "share": [36,416],
      "bubble": [243,420],
      "dotdotdot": [584,426],
      "updoot": [686,426],
      "downdoot": [832,428],
    }

    var sizeOfIcon = {
      "alien": "large",
      "logotype": "wide",
      "choice": "medium",
      "pencil": "medium",
      "search": "medium",
      "hamburger": "medium",
    }

    var icon = element.template(
      ".icon",
      element.style({
        "background": "url(/treddi.gif)",
        "overflow": "hidden",
        "display": "inline-block",
        "vertical-align": "middle",
        "width": "44px",
        "height": "44px",
        "box-sizing": "border-box",

        ".icon-large": {
          "width": "88px",
          "height": "88px"},

        ".icon-wide": {
          "width": "152px",
          "height": "66px"},

        ".icon-medium": {
          "width": "66px",
          "height": "66px"},
      }),
      function(name) {
        var size = sizeOfIcon[
          name]
        var position = positionOfIcon[
          name]
        if (!position) {
          throw new Error(name+" is not an icon")
        }
        this.appendStyles({
          "background-position": "-"+position[0]+"px -"+position[1]+"px"})
        if (size) {
          this.addSelector(
            ".icon-"+size)}})



    var header = element(
      element.style({
        "width": "100%",
        "display": "flex",
        "flex-direction": "row",
        "justify-content": "space-between"}),[
      element(
        icon("alien"),
        icon("logotype"),
        icon("choice")),
      element(
        icon("pencil"),
        icon("search"),
        element(
          "a",{
          "href": "/auth"},
          icon("hamburger"))),
    ])

    var sort = element(
      element.style({
        "width": "100%",
        "display": "flex",
        "flex-direction": "row",
        "margin": "44px 0"}),[
        icon("rocket"),
        element(
          element.style({
            "margin": "0 0.5em"}),
          "Best"),
        icon("lil-choice")])

    var dot = element.template(
      ".dot",
      element.style({
        "margin": "0 8px"}),
      "&bull;")

    var page

    function post(){
      var meta = element(
        element.style({
          "display": "flex",
          "flex-direction": "row"}),[
        element(".sub", "r/funny"),
        dot(),
        "5h",
        dot(),
        "u/charbodactyl",
        dot()])

      var domain = element(
        "a",{
        "href": ""},
        element.raw("i.redd.it "),
        icon("escape"))

      var actions = element(
        ".actions",
        element.style({
          "width": "100%",
          "line-height": "66px",
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "space-between"}),[
        element(
          element.style({
            "display": "flex",
            "flex-direction": "row"}),[
          element(
            element.style({
              "cursor": "pointer",
              "padding-right": "44px"}),
            icon("share"),
            " Share"),
          element(
            icon("bubble"),
            " 257",
            element.style({
              "cursor": "pointer",
              "padding-right": "44px"})),
        ]),
        element(
          element.style({
            "display": "flex",
            "flex-direction": "row"}),[
          element(
            element.style({
              "cursor": "pointer",
              "border-right":
                "2px solid #cfcfff",
              "padding-right": "22px"}),
            icon("dotdotdot")),
          element(
            element.style({
              "cursor": "pointer",
              "padding-left": "22px"}),
            icon("updoot"),
            " 27.2k"),
          element(
            element.style({
              "padding-left": "22px"}),
            icon("downdoot")),
        ]),
      ])

      var post = element([
        meta,
        element(
          ".title",
          "Didn't like his new friend"),
        domain,
        actions,
      ])
      return post      
    }
    var stylesheet = element.stylesheet([
      icon,

      element.style(
        "body", {
          "zoom": "0.75",
          "margin": "15px",
          "font-size": "32px",
          "line-height": "44px",         
          "color": "#cfcfff",
          "font-family": "sans-serif"}),

      dot,

      element.style(
        ".sub",{
        "color": "aquamarine"}),

      element.style(
        ".title",{
        "color": "black"}),

      element.style(
        "a", {
        "color": "#5EE8EE",
        "text-decoration": "none"})
    ])

    baseBridge.addToHead(
      stylesheet)

    site.addRoute(
      "get",
      "/auth",
      function(request, response) {
        getAuthUrl(function(url) {
          response.redirect(
            url)})})

    site.addRoute(
      "get",
      "/",
      function(request, response) {
        console.log("hello")
        var error = request.query.error
        var state = request.query.state
        var code = request.query.code
        console.log("Apparently thi user's code is "+code+" (state is "+state+")")
        var bridge = baseBridge.forResponse(
          response)

        if (state && code && people.remember(state)) {
          var meId = state
          acceptARedditUserWarmly(
            response,
            meId,
            code,
            sendSite.bind(
              null,
              request,
              bridge))}
        else {
          sendSite(
            request,
            bridge)}
      })

    function sendSite(request, bridge) {
      console.log("site time!")
      getStories(request, function(stories) {
        if (stories == "who are you?") {
          console.log("No idea who this is.")
        } else {
          console.log(stories ? "stories!" : "no stories!")
        }
        var page = [header, sort, post()]
        bridge.send(page)
      })
    }

    function getStories(request, callback) {
      console.log("getting stories")
      var meId = request.cookies.meId
      var me = people.remember(meId)

      if (!me) {
        callback("who are you?")
        return}

      var url = "https://oauth.reddit.com/users/new"
      makeRequest({
        "method": "get",
        "url": url,
        "headers": {
          "Authorization": "bearer "+me.accessToken}},
        function(data) {
          console.log("mmm data")
          debugger
          callback(data)
        })
    }


    function getAuthUrl(callback) {
      rando(
        function(randomNumber) {
          callback(
            buildAuthUrl(
              randomNumber))})}

    function buildAuthUrl(peopleId) {
      universe.do("people.see", peopleId)
      people.see(peopleId)
      var url =
        "https://www.reddit.com/api/v1/authorize?client_id=vILB1viG9BmpYg&response_type=code&state="+peopleId+"&redirect_uri="+encodedRedirectUri+"&duration=temporary&scope=identity+mysubreddits+vote"
      return url}

    var SECONDS = 1
    var MINUTES = 60*SECONDS
    var HOURS = 60*MINUTES
    var DAYS = 24*HOURS
    var YEARS = 365*DAYS

    function acceptARedditUserWarmly(response, meId, code, callback) {
      console.log("acceptance. state is "+meId+" code is "+code)
      var url = "https://www.reddit.com/api/v1/access_token"

      console.log("\n\nThis is where the magic happens\n\n")
      debugger

      makeRequest({
        "method": "post",
        "url": url,
        "formData": {
          "grant_type": "authorization_code",
          "code": code,
          "redirect_uri": redirectUri},
        "auth": {
          "user": process.env.CLIENT_ID,
          "password": process.env.CLIENT_SECRET}},
        saveAccessToken)

      function saveAccessToken(json) {
        debugger
        if (!json) {
          throw new Error("We just posted to "+url+"but we seemed to have got nothing back.")
          debugger
        }
        console.log("\n--------\njson baybe!\n-------\n")
        if (json.error) {
          throw new Error("Got an error message from Reddit: "+json.error+" "+json.message)}

        if (json[
          "access_token"]) {
          console.log("got an access token! things are getting better!"+json[
          "access_token"])}

        var person = {
          accessToken: json[
          "access_token"],
          refreshToken: json[
          "refresh_token"],
          personId: meId}

        universe.do("people.identify", person)
        people.identify(person)

        console.log("setting the meId cookie, I think")
        response.cookie(
          "meId",
          meId,{
          maxAge: 1*YEARS})
        callback()}
    }


    function refreshRedditTokens(request, response, callback) {
      var url = "https://www.reddit.com/api/v1/access_token"
      var meId = request.cookies.meId
      var me = people.remember(meId)

      makeRequest({
        "method": "post",
        "url": url,
        "formData": {
          "grant_type": "refresh_token",
          "refresh_token": me.refreshToken}},
        function(data) {
          if (data["state"] !== meId) {
            throw new Error(
              "Uh uh honey")}

          me.accessToken = data[
            "access_token"]
          me.refreshToken = data[
            "refresh_token"]

          callback()})}

    site.start(3317)
  }
)