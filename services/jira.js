const Fuse = require('fuse.js');
const request = require('./services/request');

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

    async getIssuesByFixVersion(fixVersion) {
        return this
            .request("/rest/api/latest/search?jql=fixVersion%20%3D%20\"App%20" + fixVersion + "\"")
            .map(issue => issue.issues.key)
    }

    async getTransition(issue, forStatus) {
        return this
            .request(`/rest/api/latest/issue/${issue}/transitions`)
            .filter(transition => transition.to.name === forStatus)
            .id
    }

    async resolve(issues) {
        return Promise.all(issues.map(issue => {
            let transition = this.getTransition(issue, "Resolved")

            this.request(`/rest/api/latest/issue/${issue}/transitions`, 'post', {
                transition: {
                    id: transition
                }
            })
        }))
    }

    async request(api, method = 'get', data = {}) {
        return request({
          url: `${this.host}${api}`,
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