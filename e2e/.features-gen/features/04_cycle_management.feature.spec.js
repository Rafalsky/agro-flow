// Generated from: features/04_cycle_management.feature
import { test } from "../../steps/fixtures.ts";

test.describe('Cycle Management (Recurring Tasks)', () => {

  test.beforeEach('Background', async ({ Given, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "Zootechnician"', null, { page }); 
  });
  
  test('Creating a new Cycle Definition', async ({ When, Then, And, page }) => { 
    await When('I visit "/cycles"', null, { page }); 
    await And('I click "New Cycle Task"', null, { page }); 
    await And('I enter title "Weekly Vet Check"', null, { page }); 
    await And('I select day "Friday"', null, { page }); 
    await And('I select time slot "Morning"', null, { page }); 
    await And('I click "Save"', null, { page }); 
    await Then('I see "Weekly Vet Check" in the list of cycle tasks', null, { page }); 
  });

  test('Editing a Cycle Definition', async ({ Given, When, Then, But, page }) => { 
    await Given('a cycle task "Old Name" exists', null, { page }); 
    await When('I edit the task to "New Name"', null, { page }); 
    await Then('the list shows "New Name"', null, { page }); 
    await But('existing sprints are NOT updated (as per Rule 7 in FIX.md)', null, { page }); 
  });

  test('Deleting a Cycle Definition', async ({ Given, When, Then, But, page }) => { 
    await Given('a cycle task "Obsolete Task" exists', null, { page }); 
    await When('I delete "Obsolete Task"', null, { page }); 
    await Then('it is removed from the cycle list', null, { page }); 
    await But('existing tickets spawned from this cycle remain in the current sprint', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/04_cycle_management.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Zootechnician\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Zootechnician\"","children":[{"start":19,"value":"Zootechnician","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I visit \"/cycles\"","stepMatchArguments":[{"group":{"start":8,"value":"\"/cycles\"","children":[{"start":9,"value":"/cycles","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And I click \"New Cycle Task\"","stepMatchArguments":[{"group":{"start":8,"value":"\"New Cycle Task\"","children":[{"start":9,"value":"New Cycle Task","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And I enter title \"Weekly Vet Check\"","stepMatchArguments":[{"group":{"start":14,"value":"\"Weekly Vet Check\"","children":[{"start":15,"value":"Weekly Vet Check","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And I select day \"Friday\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Friday\"","children":[{"start":14,"value":"Friday","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And I select time slot \"Morning\"","stepMatchArguments":[{"group":{"start":19,"value":"\"Morning\"","children":[{"start":20,"value":"Morning","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"And I click \"Save\"","stepMatchArguments":[{"group":{"start":8,"value":"\"Save\"","children":[{"start":9,"value":"Save","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I see \"Weekly Vet Check\" in the list of cycle tasks","stepMatchArguments":[{"group":{"start":6,"value":"\"Weekly Vet Check\"","children":[{"start":7,"value":"Weekly Vet Check","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":20,"pickleLine":15,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Zootechnician\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Zootechnician\"","children":[{"start":19,"value":"Zootechnician","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":16,"keywordType":"Context","textWithKeyword":"Given a cycle task \"Old Name\" exists","stepMatchArguments":[{"group":{"start":13,"value":"\"Old Name\"","children":[{"start":14,"value":"Old Name","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I edit the task to \"New Name\"","stepMatchArguments":[{"group":{"start":19,"value":"\"New Name\"","children":[{"start":20,"value":"New Name","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then the list shows \"New Name\"","stepMatchArguments":[{"group":{"start":15,"value":"\"New Name\"","children":[{"start":16,"value":"New Name","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"But existing sprints are NOT updated (as per Rule 7 in FIX.md)","stepMatchArguments":[]}]},
  {"pwTestLine":27,"pickleLine":21,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Zootechnician\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Zootechnician\"","children":[{"start":19,"value":"Zootechnician","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":22,"keywordType":"Context","textWithKeyword":"Given a cycle task \"Obsolete Task\" exists","stepMatchArguments":[{"group":{"start":13,"value":"\"Obsolete Task\"","children":[{"start":14,"value":"Obsolete Task","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"When I delete \"Obsolete Task\"","stepMatchArguments":[{"group":{"start":9,"value":"\"Obsolete Task\"","children":[{"start":10,"value":"Obsolete Task","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then it is removed from the cycle list","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"But existing tickets spawned from this cycle remain in the current sprint","stepMatchArguments":[]}]},
]; // bdd-data-end