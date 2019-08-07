var library = require("module-library")(require)

// The Reddit Everyone Deserves Dang It

library.using(
  ["web-site", "browser-bridge", "web-element", "add-html", "crypto", "make-request"],
  function(WebSite, BrowserBridge, element, addHtml, crypto, makeRequest) {

    var baseBridge = new BrowserBridge()
    var site = new WebSite()

    var redirectUrl = "http://localhost:3317/"

    var encodedRedirectUrl = encodeURIComponent(
      redirectUrl)

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
        var error = request.query.error
        var state = request.query.state
        var code = request.query.code

        var bridge = baseBridge.forResponse(
          response)
        var page = [header, sort, post()]

        if (state && code && states[state]) {
          acceptARedditUserWarmly(
            bridge,
            state,
            code,
            function() {
              bridge.send(
                page)})}
        else {
          bridge.send(
            page)}
      })


    var people = {}

    function getAuthUrl(callback) {
      rando(
        function(peopleId) {
          people[peopleId] = {
            accessToken: null,
            refreshToken: null,
            peopleId: null,
          }
          var redditOauthUrl =
            "https://www.reddit.com/api/v1/authorize?client_id=vILB1viG9BmpYg&response_type=code&state="+peopleId+"&redirect_uri="+encodedRedirectUrl    +"&duration=temporary&scope=mysubreddits"
            callback(
              redditOauthUrl)})}

    function acceptARedditUserWarmly(response, meId, code, calback) {
  
        var url = "https://www.reddit.com/api/v1/access_token"

        var postData = "grant_type=authorization_code&code="+code+"&redirect_uri="+redirectUrl

        makeRequest({
          "method": "post",
          "url": url,
          "data": postData
        },function(json) {
          var accessToken = 
          var refreshToken = json[
            "refresh_token"]
          var me = people[meId]

          me.accessToken = json[
            "access_token"]
          me.refreshToken = json[
            "refresh_token"]
          me.peopleId = meId

          response.cookies.meId = meId

          callback(accessToken)
        })
    }


    function refreshRedditToken(request, response, callback) {
      var url = "https://www.reddit.com/api/v1/access_token"
      var postData = "grant_type=refresh_token&refresh_token="+request.cookies.refreshToken

      makeRequest({
        "method": "post",
        "url": url,
        "data": postData
      },function(data) {
        var meId = request.cookies.meId
        var me = people[
          meId]

        if (data["state"] !== meId) {
          throw new Error(
            "Uh uh honey")}

        me.accessToken = data[
          "access_token"]
        me.refreshToken = data[
          "refresh_token"]

        callback()})
    }

    site.start(3317)
  }
)