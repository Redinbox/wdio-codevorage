// node - native
const fs = require('fs')
const path = require('path')
const crypto = require("crypto");

// npm
const libCoverage = require('istanbul-lib-coverage')


const DIR = '.nyc_output'

class Singleton {
    constructor() {
        this._data = []
    }

    async collect () {
        const data = await browser.execute(function () {
            const coverage = window.__coverage__
            // delete coverage information, so next text has a fresh start
            window.__coverage__ = null
            delete window.__coverage__
            return coverage
        })
        this._data.push(data)
    }

    createMerge() {
        const id = crypto.randomBytes(30).toString('hex');
        const targetPath = path.join(DIR, path.basename(id)) + '.json'
        const map = libCoverage.createCoverageMap({})

        this._data.map((report) => map.merge(report))
       
        return new Promise(function(resolve) {
            fs.mkdir(DIR, { recursive: true }, (err) => {
                if (err) throw err;
                fs.writeFile(targetPath, JSON.stringify(map, null, 2), 'utf8', ()=>{
                    resolve();
                });
            });
        });
    }

    clean(){
        this._data = []
        fs.rmSync(path.basename(DIR), { maxRetries: 5, retryDelay: 1000, recursive: true, force: true })
    }
}
exports.default = new Singleton()
