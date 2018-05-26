var AWS = require('aws-sdk');


AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});
var dynamodb = new AWS.DynamoDB();
// Waits for tables to be come ACTIVE.
// Useful for waiting for table operations like CreateTable to complete.
var params = {
  TableName: 'dnaStats'
};
// Supports 'tableExists' and 'tableNotExists'
dynamodb.waitFor('tableExists', params, function (err, data) {
  if (err) console.log(err); // an error occurred
  else insertData(); // successful response
});

function insertData() {
  var docClient = new AWS.DynamoDB.DocumentClient();

  console.log("Preparing stats table....");

  for (var i = 0; i < 100; i++) //I am using 100 buckets for statistics record
  {
    var mutantRow = {
      TableName: "dnaStats",
      Item: {
        "counterDescriptor": "mutantStat" + i,
        "count": 0
      }
    };
    var nonMutantRow = {
      TableName: "dnaStats",
      Item: {
        "counterDescriptor": "nonMutantStat" + i,
        "count": 0
      }
    };

    insertRow(mutantRow);
    insertRow(nonMutantRow);

  }

  function insertRow(mutantRow) {
    docClient.put(mutantRow, function (err, data) {
      if (err) {
        console.error("Unable to add", mutantRow.Item.counterDescriptor, ". Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("PutItem succeeded:", mutantRow.Item.counterDescriptor);
      }
    });
  }

  var params = {
    TableName: "dnaStats",
    ProjectionExpression: "counterDescriptor, #ct",
    ExpressionAttributeNames: {
      "#ct": "count"
    }
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
      console.log("Items found:" + data.Items.length);
    }
  });
}

