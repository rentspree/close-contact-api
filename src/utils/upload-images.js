import _ from "lodash"
import path from "path"
import https from "https"
import fs from "fs"
import mkdirp from "mkdirp"
import config from "../config"
import * as gCloudStorage from "./gcloud-storage"

/**
 * This method will upload image to gcloud and return url of the image
 * @param {User} userID the id of user
 * @param {Object} uploadPath the path of file destination
 * @param {String} resizeImage the flag for trigger image resize
 * @param {String} mimeType the mime type of imput file
 * @param {String} filePath the path of input file
 * @returns {String} string of image url in google storage
 */
export async function uploadImage(
  userID,
  uploadPath,
  resizeImage,
  mimeType,
  filePath,
) {
  const destination = path.join(
    uploadPath,
    `${_.toString(userID)}.${_.last(mimeType.split("/"))}`,
  )
  const options = {
    destination,
    metadata: { contentType: mimeType },
    public: true,
  }
  const data = await gCloudStorage.upload(filePath, options, resizeImage)
  if (data && data.name && data.bucket) {
    return `https://storage.googleapis.com/${data.bucket}/${data.name}`
  }
  return null
}

export function downloadProfilePicture(imageUrl, userID, mimeType) {
  return new Promise(resolve => {
    if (!fs.existsSync(config.imagePath)) {
      mkdirp(config.imagePath)
    }
    https.get(imageUrl, httpsResponse => {
      let data = ""
      httpsResponse.setEncoding("binary")
      httpsResponse.on("data", chunk => {
        data += chunk
      })

      httpsResponse.on("end", () => {
        const fileName = `${_.toString(userID)}.${_.last(mimeType.split("/"))}`
        const fullPath = `${config.imagePath}/${fileName}`
        fs.writeFileSync(`${config.imagePath}/${fileName}`, data, "binary")
        resolve(fullPath)
      })
    })
  })
}
