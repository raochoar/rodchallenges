# Rod Challenges repository
Personal repository for testing some algorithms and cloud services.

# Dna Analyzer REST API
This is a REST API implemented with Node.JS using expressJS and DynamoDB as a NoSQL database.

## Dna installation / environment setup

Since this project store the results in a NoSQL database you will need to setup a local DynamoDB on your development environment to start to test this.
Please follow this steps to setup your DynamoDB and NodeJS.

1. Go to [Amazon instructions pages for download Local DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
2. Download the zip file and extract it in any folder of your preference.
3. Setup your AWS credentials (for local development any value will work, but if you want to test with production code you will need your owns values). Please follow [this link](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html) for more instructions.
4. Clone the repository:
```
git clone https://github.com/raochoar/rodchallenges.git
```
5. Install node in your environment. Please use 6.X version. [Click here for linux instrucctions](https://nodesource.com/blog/installing-node-js-tutorial-ubuntu/)
6. Install npm dependencies:
```
npm install
```
7. start your local DynamoDB development database using this command:
```
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -inMemory 
```
This command will start a in-memory database for development listening at port 8000.
8. Lets go and edit the file dnaApp/environmentConfig.js . Be sure that the endpoint is localhost:8000 (if you want to use it on development mode). For production please choose the correct DynamoDB endpoint from [this page](https://docs.aws.amazon.com/general/latest/gr/rande.html)
 ```javascript
 var settings = {
   AWSSettings: {
     region: "sa-east-1",
     //endpoint: "http://dynamodb.sa-east-1.amazonaws.com" PRODUCTION VALUE FOR LATIN AMERICA
     endpoint: "http://localhost:8000" //DEVELOPMENT VALUE
   }
 };
 
 module.exports = settings;
 ```
 9. Initialize the database: This command will remove all the current tables and value and will reset your database to a initial state. Please execute this command to setup your database at first time:
```
npm run initDatabase
```
 10. Start the application for development:
```
npm run start
```
The application will start to listening at port 3000. So you can start to interact locally with this endpoint: http://localhost:3000

## Rest layer documentation
### /mutant
This api will return 200 Ok if the dna matches with a mutant pattern. If not the API will return 403 Forbidden.

Request sample:
```
POST http://localhost:3000/mutant
Content-Type: application/json
Body:
{
	"dna":
	["ATGCGT",
	 "CCGTGA",
	 "TTATGT",
	 "AGAAGG",
	 "CTCATA",
	 "ACACAG"
	]	

}
```
Response sample:
```
Status: 403 Forbidden
Content-Type: text/html; charset=utf-8
Body:
Sorry this API is not for regular DNA.
```
### /stats 
This API returns stats information, including the number of mutant vs human dna in database. And a ratio that is calculated using this formula: mutant_total / (mutant_totals + human_totals).

Request Sample:
```
GET http://localhost:3000/stats
```

Response sample:
```
Status: 200
Content-Type: application/json; charset=utf-8
Body:
{
    "count_mutant_dna": 11,
    "count_human_dna": 8,
    "ratio": 0.58
}
```

## Testing DNA Application
This API has 2 level of test:

*Unit test*: this test does not have dependencies with external resources like DynamoDB. To run this unit test you need to execute this npm command:
```
npm run unitTest
```

*End to End Test*: this test requires access to a production or local DynamoDB. Please avoid to execute this on production because this test will delete all database information and populate with QA data:
```
npm run e2eTest
```
To execute end to end test you need a DynamoDB properly working and configured.

*Coverage information*:
You can get the coverage information (a join of end to end + unit coverage) by executing this command:
```
 npm run unitAndE2EtestCoverage
 ```
 Please consider that your database will be re-built because of the execution of e2e, so please avoid to do it on production.
 
 ## Executing this API on a production environment
 To execute this on a production environment you need to change the endpoint in: dnaApp/environmentConfig.js (and use one of the correct supplied by AWS services)
 
 Also you need to install pm2 running environment in your linux machine:
 ```
 sudo npm install pm2 -g
 ```
 
 After you install this you can follow this command to start the server:
```
pm2 start ./bin/www -i max
 ```
 This will start as many thread as cores in your environment and it will have a internal load balancer to improve request performance.
 
 This are other useful commands for production troubleshooting:
 
 *Stop the application:*
 ```
 pm2 stop www
 ```
 
 *Monitor the application:*
  ```
  pm2 monit
  ```

*See logs:*
  ```
  pm2 logs www --format
  ```

## Other tools for development:
There is a web console to render the local dynamoDB data. You can start that console using this command:
```
 npm run databaseAdminClient
 ```
Tha will host an admin console on this endpoint: http://localhost:8001

There is also a cloud monitoring app here https://app.keymetrics.io (if your pm2 is linked to your account and service)

## Deployment schema 

Following this deployment schema you will get a scalable elastic performance according to the load requirements:

![DeploymentSchema](https://github.com/raochoar/rodchallenges/blob/master/docs/Deployment%20Schema%20to%20improbe%20scalability.PNG?raw=true)
