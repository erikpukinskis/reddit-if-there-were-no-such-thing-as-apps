var library = require("module-library")(require)

// The Reddit Everyone Deserves Dang It

library.using(
  ["web-site", "browser-bridge", "web-element", "add-html", "crypto"],
  function(WebSite, BrowserBridge, element, addHtml, crypto) {

    var bridge = new BrowserBridge()
    var site = new WebSite()

    rando(function(rand) {
      var redditOauthUrl = "https://www.reddit.com/api/v1/authorize?client_id="+process.env.REDDIT_CLIENT_ID+"&response_type=code&state="+rand+"&redirect_uri="+encodeURIComponent("http://www.redditiftherewerenosuchthingasapps.com")+"&duration=permanent&scope=mysubreddits"
      console.log(redditOauthUrl)
    })


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
      "escape": [152,358],
      "share": [36,416],
      "bubble": [243,420],
      "updoot": [686,426],
      "downdoot": [832,426],
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
        this.appendStyles({
          "background-position": "-"+position[0]+"px -"+position[1]+"px"})
        if (size) {
          this.addSelector(
            ".icon-"+size)}})



    var page = element(
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
        icon("search")),
    ])



    var stylesheet = element.stylesheet([
      icon,

      element.style(
        "body", {
          "font-family": "sans-serif"}),
    ])

    bridge.addToHead(
      stylesheet)

    
    site.addRoute("get", "/", bridge.requestHandler(page))

    site.start(3317)
  }
)