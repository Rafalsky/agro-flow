// Generated from: features/06_shifts_planning.feature
import { test } from "../../steps/fixtures.ts";

test.describe('Shifts Planning', () => {

  test.beforeEach('Background', async ({ Given, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as "Zootechnician"', null, { page }); 
  });
  
  test('Scheduling Shifts', async ({ When, Then, And, page }) => { 
    await When('I visit "/shifts" (or planning view)', null, { page }); 
    await And('I select "Worker A"', null, { page }); 
    await And('I assign a shift for "2025-12-05" from "08:00" to "16:00"', null, { page }); 
    await And('I save the changes', null, { page }); 
    await Then('"Worker A" sees their shift on the board or calendar for "2025-12-05"', null, { page }); 
  });

  test('Viewing Shifts', async ({ When, Then, page }) => { 
    await When('I view the shifts for week "2025-12-01"', null, { page }); 
    await Then('I see all assigned shifts for all workers', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/06_shifts_planning.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Zootechnician\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Zootechnician\"","children":[{"start":19,"value":"Zootechnician","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I visit \"/shifts\" (or planning view)","stepMatchArguments":[{"group":{"start":8,"value":"\"/shifts\"","children":[{"start":9,"value":"/shifts","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And I select \"Worker A\"","stepMatchArguments":[{"group":{"start":9,"value":"\"Worker A\"","children":[{"start":10,"value":"Worker A","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And I assign a shift for \"2025-12-05\" from \"08:00\" to \"16:00\"","stepMatchArguments":[{"group":{"start":21,"value":"\"2025-12-05\"","children":[{"start":22,"value":"2025-12-05","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":39,"value":"\"08:00\"","children":[{"start":40,"value":"08:00","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":50,"value":"\"16:00\"","children":[{"start":51,"value":"16:00","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And I save the changes","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then \"Worker A\" sees their shift on the board or calendar for \"2025-12-05\"","stepMatchArguments":[{"group":{"start":0,"value":"\"Worker A\"","children":[{"start":1,"value":"Worker A","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":57,"value":"\"2025-12-05\"","children":[{"start":58,"value":"2025-12-05","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":18,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged in as \"Zootechnician\"","isBg":true,"stepMatchArguments":[{"group":{"start":18,"value":"\"Zootechnician\"","children":[{"start":19,"value":"Zootechnician","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When I view the shifts for week \"2025-12-01\"","stepMatchArguments":[{"group":{"start":27,"value":"\"2025-12-01\"","children":[{"start":28,"value":"2025-12-01","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then I see all assigned shifts for all workers","stepMatchArguments":[]}]},
]; // bdd-data-end