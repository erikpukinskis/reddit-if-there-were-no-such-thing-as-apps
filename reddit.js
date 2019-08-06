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
        icon("hamburger")),
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

    var page = [header, sort, post]


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

    bridge.addToHead(
      stylesheet)

    
    site.addRoute("get", "/", bridge.requestHandler(page))

    site.start(3317)
  }
)