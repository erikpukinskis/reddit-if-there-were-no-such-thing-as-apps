var library = require("module-library")(require)

library.using(
  [library.ref(), "web-site", "browser-bridge", "web-element", "add-html"],
  function(lib, WebSite, BrowserBridge, element, addHtml) {

    var bridge = new BrowserBridge()
    var site = new WebSite()

    site.addRoute(
      "get",
      "/reddit.gif",
      site.sendFile(
        __dirname,
        "reddit.gif"))

    var icon = element.template(
      ".icon",
      element.style({
        "background": "url(/reddit.gif)",
        "overflow": "hidden",
        "width": "44px",
        "height": "44px",

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
      function(size, position) {
        this.appendStyles({
          "background-position": "-"+position[0]+"px -"+position[1]+"px"
        })
        if (size) {
          this.addSelector(
            ".icon-"+size)}})

    var positionOfIcon = {
      "alien": [14,14],
      "logotype": [107,20],
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

    var icons = []
    for(var name in positionOfIcon) {
      icons.push(
        icon(
          sizeOfIcon[
            name],
          positionOfIcon[
            name]))
      icons.push(
        name)}

    var stylesheet = element.stylesheet([
      icon,

      element.style(
        "body", {
          "font-family": "sans-serif"}),
    ])

    bridge.addToHead(
      stylesheet)

    var page = element(
      icons)
    
    site.addRoute("get", "/", bridge.requestHandler(page))

    site.start(3317)
  }
)