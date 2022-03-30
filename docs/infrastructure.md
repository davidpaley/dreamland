# Infrastructure

I would implement the infrastructure with AWS.

## Sharding

I would apply sharding by user. So I would use the userID to split in smaller chunks the different tables and stored in multiple data nodes in the different regions. So, for example, we could have from user ID 0 to user 30.000 in node 1, from 30.000 to 60.000 in node 2 and so on for the region 1.

Every node would have read replicas to access some of the data.

## Multi-Region Application

### Security

With AWS Identity and Access Management (IAM), we could operate in a global context by default. With IAM, we specify who can access which AWS resources and under what conditions.
Database passwords, should use AWS Secrets Manager. It encrypts secrets with AWS Key Management Service (AWS KMS) keys and can replicate secrets to secondary Regions to ensure applications are able to obtain a secret in the closest Region.

### Global Network

For resources launched into virtual networks in different Regions, Amazon Virtual Private Cloud (Amazon VPC) allows private routing between Regions and accounts with VPC peering. These resources can communicate using private IP addresses and do not require an internet gateway, VPN, or separate network appliances.

We could use AWS Transit Gateway to connect our VPCs through a central hub.

### EC2 vs Lambda

In the beginning, if we don't know the number of requests that we are going to have at the same time (and it is not going to be so many), and we don't know the frequency of that amount of requests, maybe we could think to implement this API through Lambda functions.

We should take into account that if it takes too much time to process the requests (Lambda functions run up to 15 minutes per execution), we are not going to be able to implement lambdas. Usually, Lambdas are more expensive for the same amount of requests than an EC2, but if it is not going to be so much, and it is not going to be stable the frequency of requests, it could be cheaper at the beggining.

Eventually, we are going to use EC2 (perhaps from the first step).

Once we have EC2 instances, to track where instances are provisioned, we could use Amazon EC2 Global View. This would provide a centralized dashboard to see Amazon EC2 resources such as instances, VPCs, subnets, security groups, and volumes in all active Regions.

We could implement Kubernetes to handle the API requests with EC2.

### Database across regions

We could use [Amazon Aurora global](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html) database for scaling of database reads across Regions. We could use the Postgres Aurora database engines.

With Aurora global database, one primary Region is designated as the writer, and secondary Regions are dedicated to reads. We could have this for different parts of the world. Like one primary region for USA with their read replicas. Another one for Europe, with the same, and so on.

### Application Management and Monitoring

Implement IaC with aws-cdk or terraform, to define different infrastructure for different regions with code.

### Get global data for stats

To share data between the different regions and get international data, we could send messages to a central SQS queue. Here, a lambda could take the data from that SQS queue and process it as necessary into a global central database.

### Monitoring the application

To maintain visibility over an application deployed across multiple Regions and accounts, we can create a Trusted Advisor dashboard and an operations dashboard with AWS Systems Manager Explorer. The operations dashboard offers a unified view of resources, such as Amazon EC2, Amazon CloudWatch, and AWS Config data.

We can view metrics from applications and resources deployed across multiple Regions in the CloudWatch console. In this way, we could create graphs and dashboards for different regions. Cross-account functionality is also available in CloudWatch, so we can create a centralized view of dashboards, alarms, and metrics across our organization.

## GDPR

Points to take into account for GDPR:

- Be able to delete user data when we need to do it. We could create an endpoint that deletes the sencible data for a given user (without having to delete the whole record, in case this cause problems in the DB in general)
- Validate that people from some region can't request a database that is on another region (that is forbidden because of GDPR).
- With Lambda Edge functions we could validate things like Content security policy headers.
- Imagine that we need to send a file (like a PDF) to some institution. Imagine that we have to do that every time an event happens, like a user transaction. This would be for audits. In that case, we could:

1. Create the file after the transaction is done in the API
2. Upload that file to an S3 bucket
3. A lambda function could take that file and send it to the correct destination for this institution to audit, with other data of other users.
