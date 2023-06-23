var elasticsearch = require('elasticsearch');
var fs = require('fs');
const matter = require('gray-matter');  
var envConfig = require('dotenv').config()

var client = new elasticsearch.Client({
    hosts: ['http://elastic:'+process.env.ES_PASSWORD+'@localhost:9200']
});

function deleteIndexFn(indexName) {
    client.indices.exists({ index: indexName }, function (err, resp) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(resp)
        if (resp) { // if index exists - delete
            console.log(indexName + ' exists and will be deleted');
            client.indices.delete({
                index: indexName
            })
        }
        createIndexFn(indexName);
    });
}


function createIndexFn(indexName) {
    client.indices.exists({ index: indexName }, function (err, resp) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(resp)
        console.log(indexName + ' creation...');
        client.indices.create({
            index: indexName,
            body: {
                mappings: {
                    properties: {
                        title: { "type": "text" },
                        subtitle: { "type": "text" },
                        contributor: { "type": "object"},
                        pub_date: { "type": "date" },
                        pub_type: { "type": "text"},
                        doi: { "type": "text" },
                        issn: { "type": "integer" },
                        language: { "type": "text" },
                        layout: { "type": "text" },
                        order: { "type": "short" },
                        references: { "type": "text" },
                        series_issue_number: { "type":"text" },
                        series_periodical_name: { "type": "text" },
                        abstract: { "type": "text" },
                        acknowledgements: { "type": "text" }
                    }
                }
            }
        })
    })
}

function addDocument(_id, data, indexName, refArray) {
    console.log(indexName)
    client.index({
        index: indexName,
        // type: "document",
        id: _id,
        body: {
            title: data.title,
            subtitle: data.subtitle,
            contributor: data.contributor,
            pub_date : data.pub_date,
            pub_type: data.pub_type,
            doi: data.doi,
            issn: data.issn,
            language: data.language,
            layout: data.layout,
            order: data.order,
            references: refArray,
            series_issue_number: data.series_issue_number,
            series_periodical_name: data.series_periodical_name,
            abstract: data.abstract,
            acknowledgements: data.acknowledgements,
        }
    }, function (err, resp){
        if (err) {
            console.log(err)
        } 
    })
}


function readAllFolder(rootDir, includeDirs, includeDirsBoolean, currentDir, indexName) {
    const readRootDir = fs.readdirSync(rootDir);
    readRootDir.forEach((innerFiles) => {
        if (includeDirsBoolean === true) {
            if (includeDirs?.includes(innerFiles)) {
                console.log(innerFiles);
                if (fs.lstatSync(rootDir + "/" + innerFiles).isDirectory()) {
                    var path = rootDir + "/" + innerFiles
                    readAllFolder(path, includeDirs, false, path, indexName); // if dir then go through files
                }
            }
        } else {
            console.log(innerFiles)
            var markdownData = matter.read(currentDir + "/" + innerFiles);
            const random_uuid = uuidv4(); 
            if (typeof markdownData.data.references !== 'undefined') {
                var refArray = markdownData.data.references.map(String)
            }
            addDocument(random_uuid, markdownData.data, indexName, refArray)
        }
    });
};


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}



module.exports = {
    setupES : deleteIndexFn,
    createES : createIndexFn,
    getFiles : readAllFolder,
}
