const Fuse = require('fuse.js');
const request = require('./request');

class Jira {
    constructor({
        host,
        email,
        token,
    }) {
        this.host = host;
        this.token = token;
        this.email = email;
    }

    async getIssuesByFixVersion(prefix, fixVersion) {
        let response = await this.request(`/rest/api/latest/search?jql=fixVersion%20%3D%20\"${prefix}%20${fixVersion}\"`)
        return response.issues.map(issue => issue.key)
    }

    async getTransition(issue, forStatus) {
        let response = await this.request(`/rest/api/latest/issue/${issue}/transitions`)

        return response
            .transitions
            .filter(transition => transition.name === forStatus)
            .shift()
            .id
    }

    async resolve(issues) {
        let resolved = []
        let errors = []

        await Promise.all(
            issues.map(async issue => {
                try {
                    let transition = await this.getTransition(issue, "Resolve")

                    console.log(`Resolving ${issue} with transition ${transition}`)

                    this.request(`/rest/api/latest/issue/${issue}/transitions`, 'post', {
                        transition: {
                            id: transition
                        }
                    })

                    resolved.push(issue)
                } catch (e) {
                    console.log(`Error resolving ${issue}: ${e}`)

                    errors.push({
                        issue,
                        error: e
                    })
                }
            })
        )

        return {
            resolved,
            errors
        }
    }

    async request(api, method = 'get', data = {}) {
        return request({
            url: `https://${this.host}${api}`,
            method,
            data,
            headers: {
                user: this.email + ":" + this.token
            },
            auth: {
                username: this.email,
                password: this.token,
            },
        });
    }
}

module.exports = Jira;