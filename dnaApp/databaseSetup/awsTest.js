var AWS = require('aws-sdk');

var s3 = new AWS.S3();

// Los nombres de buckets deben ser únicos entre todos los usuarios de S3

var myBucket = 'daxmorsu.bucket.unique';

var myKey = 'myBucketKey';

s3.createBucket({Bucket: myBucket}, function (err, data) {

  if (err) {

    console.log(err);

  } else {

    params = {Bucket: myBucket, Key: myKey, Body: 'Hello!'};

    s3.putObject(params, function (err, data) {

      if (err) {

        console.log(err)

      } else {

        console.log("Successfully uploaded data to myBucket/myKey");

      }

    });

  }

});