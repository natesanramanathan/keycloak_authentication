# Introduction

This guide is intended for the operations team responsible for the monitoring, maintenance, and troubleshooting of the Keycloak HA environment. The architecture uses Azure Virtual Machines (VMs), Azure Load Balancer, Azure PostgreSQL, Azure Active Directory (AAD), and Azure Blob Storage for backup & restoration.

## Key responsibilities include but not limited to :

- Monitoring system health and performance.
- Performing routine maintenance tasks such as backups and log rotation.
- Troubleshooting issues related to the Keycloak VMs, database, and authentication services.

# Monitoring

## Overview

To ensure the system operates smoothly, several critical components must be monitored:

- **Azure Virtual Machines**: Running Keycloak instances.
- **Azure Load Balancer**: Distributing incoming traffic across Keycloak instances.
- **Azure Database for PostgreSQL**: Storing Keycloak user and session data.
- **Azure Active Directory**: Handling federated authentication requests.
- **Azure Blob Storage**: Storing backups of Keycloak configurations and PostgreSQL snapshots.

**Azure Monitor is the tool deployed for monitoring**, which integrates with **Log Analytics** for gathering and analysing logs.

## Key Monitoring Metrics and Setup in Azure Portal

### Metric: CPU Utilization

- **Where to Monitor**: Azure Portal > Virtual Machines > Select VM > Monitoring > Metrics.
- **Threshold**: Set alerts for when CPU usage exceeds 80% for over 10 minutes. Use Azure Monitor to configure alert rules.

### Metric: Memory Usage

- **Where to Monitor**: Azure Portal > Virtual Machines > Select VM > Monitoring > Metrics > Add Metric > Memory Usage.
- **Threshold**: Set alerts for when memory usage exceeds 75%.

### Metric: Disk I/O

- **Where to Monitor**: Azure Portal > Virtual Machines > Select VM > Metrics > Disk Operations/Sec.
- **Threshold**: Monitor and set alerts for high I/O activity.

### Metric: Network Traffic

- **Where to Monitor**: Azure Portal > Virtual Machines > Networking > Monitoring.
- **Threshold**: Monitor network spikes and set alerts for sudden increases in traffic.

## Setting up Alerts in Azure Portal

Refer below steps to ensure proactive monitoring, set up alerts using Azure Monitor, to create alert rules for critical metrics:

- **Navigate to Azure Monitor**: Go to Azure Portal > Monitor > Alerts > Create Alert Rule.

### Configure the Alert Rule

- **Target Resource**: Select the specific Azure resource (e.g., VM, Load Balancer, PostgreSQL).
- **Condition**: Define the condition (e.g., CPU utilization > 80% for 5 minutes).
- **Action Group**: Define the recipients of the alerts (email, SMS, or webhook).
- **Severity**: Assign a severity level (e.g., Critical, Warning).

### Activate the Rule

- Review the alert rule settings and activate it.

### Sample Alert Configuration

- **Resource**: Azure Virtual Machine running Keycloak.
- **Metric**: CPU Utilization.
- **Condition**: Greater than 80% for 10 minutes.
- **Action Group**: Email operations team and trigger an Azure Automation script to scale the VM instances.
- **Severity**: Critical.

# Maintenance

Maintaining the Keycloak HA setup in Azure requires consistent attention to ensure optimal performance and scalability, which involves

## Routine Maintenance Tasks Using Azure Portal

### Backup Verification

- **Check Backup Status**: Go to Azure Portal > Storage Account > Containers > Backups.
  - Ensure that backups of both PostgreSQL and Keycloak configurations are uploaded successfully.
  - Best Practice is to Automate daily/weekly verification using Azure Automation or custom scripts.

### Log Management

- **Log Rotation**: Navigate to Azure Portal > Log Analytics Workspaces > Logs.
  - Configure log rotation to prevent logs from consuming excessive space on VMs.
  - Retention Policy: Set retention policies for logs stored in Azure Log Analytics to automatically archive or delete logs older than a defined period (e.g., 90 days).

### VM Health Checks

- **Manual Health Check**: Go to Azure Portal > Virtual Machines > Select VM > Metrics.
  - Review CPU, memory, disk performance, and networking metrics to ensure the VMs are running optimally.
- **OS Patching**: Navigate to Azure Portal > Update Management to ensure all VMs are up to date with the latest OS patches.

### Scheduling Backup with Cron

Backup jobs can be scheduled using the backup_keycloak.yml playbook to run automatically at a specific time using a cron job.

- **Create a Cron Job**
  - Command: crontab -e
- **Add a Schedule**: Below command will run the backup playbook every day at midnight.
  - 0 0 \* \* \* ansible-playbook -i /path/backup_keycloak.yml

# Troubleshooting

Troubleshooting includes Incident & Problem management w.r.t. Keycloak server & Infra administration. The Operations engineer should take care of below aspects (which are not exhaustive), right from their Day-1 of Keycloak administration.

## Keycloak Instance Failure

If One or more Keycloak instances fail to respond or become inaccessible.

**Solution Approach**:

- Check the Azure Monitor for any alerts related to CPU, memory, or network spikes.
- SSH into the affected VM and check the Keycloak logs located at /opt/keycloak/standalone/log/server.log.
- Attempt to restart the VM from the Azure Portal or by SSH.
- If restarting the VM doesn’t resolve the issue, restart the Keycloak service
  - Command : sudo systemctl restart keycloak

## Load Balancer Health Probe Failures

The Azure Load Balancer shows health probe failures for Keycloak instances.

**Solution Approach**:

- Ensure that the Keycloak instance is reachable on its health probe URL (e.g., /auth/realms/master).
- Verify CPU and memory usage on the VM to ensure there are no bottlenecks.
- Check network settings to ensure that the VM is reachable by the Load Balancer.

## PostgreSQL Database Connectivity Issues

Keycloak is unable to connect to the PostgreSQL database, leading to authentication failures.

**Solution Approach**:

- Verify database connectivity from the Keycloak VM using the PostgreSQL command line
  - psql -h keycloak-db.postgres.database.azure.com -U adminuser -d keycloakdb
- Check the PostgreSQL server logs in Azure for any connection limit or authentication errors.
- Ensure that SSL is enabled for secure communication between Keycloak and PostgreSQL.

This Operations Guide outlines essential procedures and tools for the operations team to effectively maintain and troubleshoot the Keycloak HA setup. Azure monitor can be integrated to provide continuous monitoring of system health. Regular maintenance tasks, including backup verification and VM health checks, should be scheduled to proactively prevent downtime.

## Keycloak Administration

- Once your Backend Infrastructure has been configured, you can be able to access the keycloak URL: [https://IPAddress:8443/](https://ipaddress:8443/).
- The first time you access the console, Keycloak will prompt you to create an initial admin user. Follow the prompts and create your admin credentials, then enter default “admin” credentials to login.

### Set Up Multi-Factor Authentication (MFA)

- Login to the Keycloak portal and navigate to Authentication à Flows à Browser Flow.
- Add a new flow or modify the existing flow to include MFA (e.g., TOTP or SMS).
  Creating a Realm
- Upon logging in Create a New Realm (security domain where all users, clients, and configurations reside)
- Navigate to the **Admin Console → Master Realm → Add Realm**
- Enter the name for your realm (e.g., MyRealm) and click "Create".
- On the left-hand side, you can see list of options and you can be able to create users/groups, roles, clients and many other configurations.
- Example: To create a user, click on Users tab and then click on “Add User” button and fill in necessary fields which will then take you to the password settings tab. Once UserID and Password has been set and saved, it stores the user data in the PostgreSQL Database.

**To check realm attributes in PostgreSQL**:
Inside PgAdmin 4 -> Keycloak DB Name -> DB -> Schema -> Tables -> Realm Attributes.

### Create a client

- Clients are entities that can request Keycloak to authenticate a user.
- Navigate to **Clients -> Create.**
- Enter the client ID (your choice) and configure:
  - Access Type: Public, Confidential, or Bearer Only.

### Create User Roles

- Navigate to Roles à Add Role.
- Define roles based on the application’s needs (e.g., admin, user, viewer).
- Assign roles to users as part of access management.

### Create a User

- Navigate to Users à Add User.
- Fill in the user details (username, email, etc.).
- After creating the user, navigate to the Credentials tab to set the user’s password.
- While creating the password, make sure to toggle off “temporary” button.
- Once logged on, with newly created user check the events and sessions within the “realm settings” .

### Configure Authentication Flows

- Navigate to Authentication àFlows.
- Review the default authentication flow through browser login.

### User and Client Management

- Manage Users
- View, add, update, and delete users within the realm.
- Use the Users section to reset passwords, assign roles, or update user attributes.

### Client Management

- Use the Clients section to manage client settings.
- Modify redirect URIs, update secrets, configure token lifespans, and more.

### Some Important Paths & files within the Keycloak Server

```
/opt/keycloak/conf à keycloak.conf
/opt/keycloak/bin à kc.sh, kc.bat
```

### Commands

- To check the status: sudo systemctl status keycloak
- To restart Keycloak services: sudo systemctl restart keycloak
