# Infrastructure

I would implement the infrastructure with AWS.

## Sharding

I would apply sharding by user. So I would use the userID to split in smaller chunks and stored in multiple data nodes the whole database for every region.

## Multi-Region Application

### Security

Creating a security foundation starts with proper authentication, authorization, and accounting to implement the principle of least privilege. AWS Identity and Access Management (IAM) operates in a global context by default. With IAM, you specify who can access which AWS resources and under what conditions.
Database passwords, should use AWS Secrets Manager. It encrypts secrets with AWS Key Management Service (AWS KMS) keys and can replicate secrets to secondary Regions to ensure applications are able to obtain a secret in the closest Region.

### Global Network

For resources launched into virtual networks in different Regions, Amazon Virtual Private Cloud (Amazon VPC) allows private routing between Regions and accounts with VPC peering. These resources can communicate using private IP addresses and do not require an internet gateway, VPN, or separate network appliances. This works well for smaller networks that only require a few peering connections. However, as the number of peered connections increases, the mesh of peered connections can become difficult to manage and troubleshoot.

AWS Transit Gateway can help reduce these difficulties by creating a central transitive hub to act as a cloud router. A Transit Gateway’s routing capabilities can expand to additional Regions with Transit Gateway inter-Region peering to create a globally distributed private network.

With multiple Regions, it can become difficult to track where instances of EC2 are provisioned. Amazon EC2 Global View helps solve this by providing a centralized dashboard to see Amazon EC2 resources such as instances, VPCs, subnets, security groups, and volumes in all active Regions.

### Database across regions

For applications that require a relational data model, [Amazon Aurora global](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html) database provides for scaling of database reads across Regions in Aurora PostgreSQL-compatible edition.

With Aurora global database, one primary Region is designated as the writer, and secondary Regions are dedicated to reads. Aurora MySQL supports write forwarding, which forwards write requests from a secondary Region to the primary Region to simplify logic in application code. We could have this for different part of the world. Like one primary region for USA with their read replicas. Another one for Europe, with the same, and so on.

======================================================
PENDING

- ultima seccion https://aws.amazon.com/es/blogs/architecture/creating-a-multi-region-application-with-aws-services-part-3-application-management-and-monitoring/
- types => explicar el problema de types de Prisma y porq elegi lo q elegi
- edge cases => transaction, problema con transactions, etc
