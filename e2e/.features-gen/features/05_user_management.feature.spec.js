// Generated from: features/05_user_management.feature
import { test } from "../../steps/fixtures.ts";

test.describe('User Management', () => {

  test.beforeEach('Background', async ({ Given, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "Zootechnician"', null, { page }); 
  });
  
  test('Listing users', async ({ When, Then, page }) => { 
    await When('I visit "/users"', null, { page }); 
    await Then('I see a list of all registered workers and zootechnicians', null, { page }); 
  });

  test('Creating a new user', async ({ When, Then, And, page }) => { 
    await When('I click "Add User"', null, { page }); 
    await And('I enter Name "New Worker" and Email "new@agro.flow"', null, { page }); 
    await And('I select role "Worker"', null, { page }); 
    await And('I submit the form', null, { page }); 
    await Then('the user "New Worker" is added to the system', null, { page }); 
    await And('I can use "new@agro.flow" to log in', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/05_user_management.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Zootechnician\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Zootechnician\"","children":[{"start":19,"value":"Zootechnician","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I visit \"/users\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/users\"","children":[{"start":9,"value":"/users","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then I see a list of all registered workers and zootechnicians","stepMatchArguments":[]}]},
  {"pwTestLine":15,"pickleLine":10,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Zootechnician\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Zootechnician\"","children":[{"start":19,"value":"Zootechnician","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I click \"Add User\"","stepMatchArguments":[{"group":{"start":8,"value":"\"Add User\"","children":[{"start":9,"value":"Add User","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"And I enter Name \"New Worker\" and Email \"new@agro.flow\"","stepMatchArguments":[{"group":{"start":13,"value":"\"New Worker\"","children":[{"start":14,"value":"New Worker","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":36,"value":"\"new@agro.flow\"","children":[{"start":37,"value":"new@agro.flow","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"And I select role \"Worker\"","stepMatchArguments":[{"group":{"start":14,"value":"\"Worker\"","children":[{"start":15,"value":"Worker","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"And I submit the form","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then the user \"New Worker\" is added to the system","stepMatchArguments":[{"group":{"start":9,"value":"\"New Worker\"","children":[{"start":10,"value":"New Worker","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And I can use \"new@agro.flow\" to log in","stepMatchArguments":[{"group":{"start":10,"value":"\"new@agro.flow\"","children":[{"start":11,"value":"new@agro.flow","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end