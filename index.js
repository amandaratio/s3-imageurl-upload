"use strict";

const AWS = require('aws-sdk'),
url_exists = require('url-exists'),
sizeOf = require('request-image-size'),
Jimp = require('jimp');

/**
 * 
 * @param {*} url 
 */
function _urlExists(url) {
    return new Promise((resolve, reject) => {
      url_exists(url, function(err, exists){
        return resolve(exists);
      });
    });
}
  
/**
 * converts img_url data into base64, returns data object ready for s3 upload
 * @param {*} img_url 
 * @param {*} dimensions 
 * @param {*} key 
 * @param {*} bucket 
 */
function _getS3Data(img_url, dimensions, key, bucket) {
  return new Promise((resolve, reject) => {
    Jimp.read(img_url, function (err, image) {
      image.resize(dimensions.width, dimensions.height);
      image.getBase64(image.getMIME(), function(err, b64){
        let buffer = Buffer.from(b64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        var data = {
          Bucket: bucket,
          Key: key, 
          Body: buffer,
          ContentType: image.getMIME(),
          ContentEncoding: 'base64',
          ACL: 'public-read'
        };
        return resolve(data);
      });
    });
  });
}


/**
 * uploads image from url as base64, returns public s3 image url
 * @param {*} awsKID 
 * @param {*} awsAK 
 * @param {*} s3Bucket 
 * @param {*} img_url 
 * @param {*} endpoint 
 * @param {*} imgKey 
 * @param {*} width 
 * @param {*} height 
 */
function upload(awsKID, awsAK, s3Bucket, imgUrl, endpoint, imgKey, width, height) {
    AWS.config.update({accessKeyId: awsKID, secretAccessKey: awsAK});
    
    let s3 = new AWS.S3(),
    img_url = imgUrl,
    s3_img_url = `${endpoint}/${imgKey}`;

    return new Promise((resolve, reject) => {
        _urlExists(img_url)
        .then(exists => {
            if (exists) {
                sizeOf(img_url)
                .then(size => {
                  let req_dimensions = width>0 && height>0 ? {width: width, height: height} : { width: size.width, height: size.height};
                  _getS3Data(img_url, req_dimensions, imgKey, s3Bucket) 
                  .then(data => {
                    s3.upload(data, function(err, data){
                      if (err) { 
                        return resolve(err);
                      } else {
                        return resolve(s3_img_url);
                      }
                    });
                  });
                })
                .catch(err => { return err });
            } else {
                return resolve(null);
            }
        })
        .catch(err => { return err });
    }); 
}

module.exports = {
    upload
};