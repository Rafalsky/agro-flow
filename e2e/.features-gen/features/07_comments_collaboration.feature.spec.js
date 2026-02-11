// Generated from: features/07_comments_collaboration.feature
import { test } from "../../steps/fixtures.ts";

test.describe('Comments and Collaboration', () => {

  test.beforeEach('Background', async ({ Given, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as a "Worker"', null, { page }); 
  });
  
  test('Adding a comment to a ticket', async ({ Given, When, Then, And, page }) => { 
    await Given('a ticket "Difficult Task" exists', null, { page }); 
    await When('I open ticket "Difficult Task"', null, { page }); 
    await And('I type "Need help with this" in the comment box', null, { page }); 
    await And('I click "Send"', null, { page }); 
    await Then('the comment "Need help with this" appears in the ticket history', null, { page }); 
    await And('"Zootechnician" can see the comment', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/07_comments_collaboration.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as a \"Worker\"","isBg":true,"stepMatchArguments":[{"group":{"start":20,"value":"\"Worker\"","children":[{"start":21,"value":"Worker","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given a ticket \"Difficult Task\" exists","stepMatchArguments":[{"group":{"start":9,"value":"\"Difficult Task\"","children":[{"start":10,"value":"Difficult Task","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I open ticket \"Difficult Task\"","stepMatchArguments":[{"group":{"start":14,"value":"\"Difficult Task\"","children":[{"start":15,"value":"Difficult Task","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And I type \"Need help with this\" in the comment box","stepMatchArguments":[{"group":{"start":7,"value":"\"Need help with this\"","children":[{"start":8,"value":"Need help with this","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And I click \"Send\"","stepMatchArguments":[{"group":{"start":8,"value":"\"Send\"","children":[{"start":9,"value":"Send","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the comment \"Need help with this\" appears in the ticket history","stepMatchArguments":[{"group":{"start":12,"value":"\"Need help with this\"","children":[{"start":13,"value":"Need help with this","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And \"Zootechnician\" can see the comment","stepMatchArguments":[{"group":{"start":0,"value":"\"Zootechnician\"","children":[{"start":1,"value":"Zootechnician","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end