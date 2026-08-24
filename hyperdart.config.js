import pkg from './package.json' with { type: 'json' };

export default {
  // Import name from package.json
  name: pkg.name,
  triggers: {
    keywords: [
      'job',
      'jobs',
      'hiring',
      'careers',
      'career',
      'internship',
      'internships',
      'openings',
      'opening',
      'vacancies',
      'vacancy',
      'recruitment',
      'employment',
      'work from home jobs',
      'remote jobs'
    ]
  },
  query_format: {
    regex: [
      '\\b(jobs?|hiring|careers?|internships?|vacanc(y|ies)|openings?)\\b',

      '\\b([a-zA-Z\\+\\#\\.\\s]{2,25})\\s+(jobs?|internships?|roles?|openings?|vacanc(y|ies))\\b',

      '\\b(jobs?|hiring|work)\\s+(in|at|for|near)\\s+([a-zA-Z\\s]+)\\b',

      '\\b(find|search|look(ing)? for|apply for)\\s+(a\\s+)?([a-zA-Z\\s]+)?(job|jobs|work|internship)\\b'
    ]
  },
  client: {
    location: pkg.module,
    moduleName: pkg.umdName || 'HD' + pkg.name,
    baseURL: '/' + pkg.name
  },
  format: {
    mainline: true,
    sidebar: true
  },
  permissions: {},
  info: {}
};