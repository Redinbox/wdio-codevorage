// npm
const collector = require('./collector').default;
exports.launcher = class CustomService {
  onPrepare() {
    collector.clean()
  }
}
exports.default = class CustomService {
  constructor(options) {
    this.options = Object.assign(options, { stdout: true })
  }

  afterSuite(){
    return collector.createMerge();
  }

  afterFeature () {
    return collector.createMerge();
  }

  /**
    * Gets executed when a refresh happens.
    * @param {String} oldSessionId session ID of the old session
    * @param {String} newSessionId session ID of the new session
    */
  onReload() {
    console.warn("Reload ocurred. Test coverage is imprecise")
    return collector.collect(browser.execute);
   
  }
  
  /**
   * Function to be executed after a test (in Mocha/Jasmine)
   * test, context, { error, result, duration, passed, retries }
   */
  afterTest() {
    return collector.collect(browser.execute);
  }
  /**
   * Function to be executed after a test (in Cucumber)
   * uri, feature, scenario, result, sourceLocation, context
   */
  afterScenario() {
    return collector.collect(browser.execute);
  }

}
