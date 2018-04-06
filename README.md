# S3 Upload Image from Url

Upload an image from a URL to s3 (AWS cloud storage) 

Parameters: 
```
    s3ImgUrl.upload(AWSaccessKeyId, AWSsecretAccessKey, s3Bucket, imgUrl, s3endpoint, s3imgKey, width, height)
    .then(s3_image_url => {
        // returns public url to image in s3 bucket (e.g, https://s3Bucket.s3.amazonaws.com/s3imgKey)
    });
```

(1) Upload image from url resized
```
    var s3ImgUrl = require('s3-imgurl-upload');
    s3ImgUrl.upload(awsKeyId, awsAccessKey, s3Bucket, 'https://some.website/image.png', `https://${s3Bucket}.s3.amazonaws.com`, 'path/fileName.jpg', 200, 260)
    .then(s3_image_url => {
        console.log(s3_image_url);
        // https://${s3Bucket}.s3.amazonaws.com/path/fileName.jpg
    });
```

(2) Upload image from url without resizing (set width and height to 0)
```
    var s3ImgUrl = require('s3-imgurl-upload');
    s3ImgUrl.upload(awsKeyId, awsAccessKey, s3Bucket, 'https://some.website/image.png', `https://${s3Bucket}.s3.amazonaws.com`, 'fileName.jpg', s3Bucket, 0, 0)
    .then(s3_image_url => {
        console.log(s3_image_url);
        // https://${s3Bucket}.s3.amazonaws.com/fileName.jpg
    });
```
