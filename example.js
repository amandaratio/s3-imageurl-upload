const s3ImgUrl = require('./');

s3ImgUrl.upload('awsKeyID', 'awsAccessKey', 's3Bucket', 'https://website.com/logo.png', `https://bucket.s3.amazonaws.com`, 'path/fileName.jpg', 200, 260)
.then(s3_image_url => {
    console.log(s3_image_url);
    // https://bucket.s3.amazonaws.com/path/fileName.jpg
});