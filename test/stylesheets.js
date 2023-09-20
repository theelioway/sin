// Test loader: This does not need changing.
var path = require("path")
var sassTrue = require("sass-true")
const { pathToFileURL } = require("url")

const importers = [
  {
    findFileUrl(url) {
      if (url.startsWith("~")) {
        return new URL(
          pathToFileURL(path.resolve("node_modules", url.substring(1)))
        )
      }
      if (url.includes("node_modules/")) {
        return new URL(
          pathToFileURL(
            path.resolve("node_modules", url.split("node_modules/")[1])
          )
        )
      }
      return null
    },
  },
]

var sassFile = path.join(__dirname, "stylesheets.scss")
sassTrue.runSass({ describe, it }, sassFile, { importers })
