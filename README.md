# Jira Auto Resolver

A GitHub Actions plugin that automatically resolves Jira tickets after a release.

## Inputs

- `jira_host`: Root host of your JIRA installation without protocol (e.g. `"yourapp.atlassian.net"`). Default: `https://vizaiinc.atlassian.net`. Optional.
- `jira_email`: Email address of the user to login with. Default: `e@email.com`. Required.
- `jira_token`: Auth token of the user to login with. Default: `knmD98cbfsd£jnfjnH?KHKH`. Required.
- `fix_version`: An existing fix version on Jira, tickets will be added to this fix version. Default: `""`. Required.
- `excluded_tickets`: Comma separated list of tickets to exclude from resolver. Default: `""`. Optional.

## Outputs

- `message`: List of tickets resolved.

## Implementation

- Runs using Node.js v16
- Main script: `index.js`

## Usage

To use this plugin, simply add the following code to your GitHub Actions workflow:

```yml
name: Jira Auto Resolver
uses: your-github-username/jira-auto-resolver
with:
  jira_email: 'e@email.com'
  jira_token: 'knmD98cbfsd£jnfjnH?KHKH'
  fix_version: '1.0.0'
```

Change the input parameters as needed.

Enjoy using Jira Auto Resolver!