const core = require('@actions/core');
const Jira = require('./services/jira');

async function main() {
  try {
    const jira = new Jira({
      host: core.getInput('jira_host'),
      email: core.getInput('jira_email'),
      token: core.getInput('jira_token'),
    })

    const fix_version = core.getInput('fix_version');
    const prefix = core.getInput('prefix');
    const excluded_tickets = core.getInput('excluded_tickets');
    
    console.log('Auto resolving issues, fix version is: ' + fix_version);

    const issues = await jira
      .getIssuesByFixVersion(prefix, fix_version)
      .filter((issue) => !excluded_tickets.includes(issue));

    console.log("Resolving issues: " + issues)

    let response = await jira.resolve(issues)

    core.setOutput('message', response);

  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
