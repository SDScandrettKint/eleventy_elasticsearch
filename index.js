var esMappings = require('./mappings.js')

// config section
var indexName = 'eleventy_index';
var contentDir = '../../content';
var excludeDirs = ['_assets', '_computed', '_data',];
var includeDirs = ['issue-01',
    'issue-02',
    'issue-03',
    'issue-04',
    'issue-05',
    'issue-06',
    'issue-07',
    'issue-08',
    'issue-09',
    'issue-10',
    'issue-23']


// This is definitely not the way to run this but I can't get promises or awaits to work so this is temp solution

esMappings.setupES(indexName)

setTimeout(function() {
    esMappings.getFiles(contentDir, includeDirs, true, currentDir=null, indexName);
}, 4000)