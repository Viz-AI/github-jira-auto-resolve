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

    console.log('Auto resolving issues, fix version is: ' + fix_version);

    const issues = await jira
      .getIssuesByFixVersion(fix_version)
      .filter((issue) => issue != core.getInput("excluded_tickets"))

    console.log("Resolving issues: " + issues)

    await jira.resolve(issues)

    core.setOutput('message', issues);

  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
