// Generated from: features/02_sprint_management.feature
import { test } from "../../steps/fixtures.ts";

test.describe('Sprint and Cycle Logic', () => {

  test('System auto-generates sprint for current week on first access', async ({ Given, When, Then, And, page }) => { 
    await Given('it is Monday "2025-12-01"', null, { page }); 
    await And('no sprint exists for week "2025-12-01" to "2025-12-07"', null, { page }); 
    await When('I visit the board', null, { page }); 
    await Then('a new sprint is created for "2025-12-01" to "2025-12-07"', null, { page }); 
    await And('the board displays the tab for "2025-12-01"', null, { page }); 
    await And('Cycle templates for this week are instantiated as tickets', null, { page }); 
  });

  test('Board defaults to current day tab', async ({ Given, When, Then, And, page }) => { 
    await Given('a sprint exists for "2025-12-01" to "2025-12-07"', null, { page }); 
    await And('today is Wednesday "2025-12-03"', null, { page }); 
    await When('I visit the board', null, { page }); 
    await Then('the sprint "2025-12-01" to "2025-12-07" is loaded', null, { page }); 
    await And('the tab "2025-12-03" (Wednesday) is selected by default', null, { page }); 
  });

  test('Sprint tickets are independent of Cycle templates after generation', async ({ Given, When, Then, And, But, page }) => { 
    await Given('a Cycle template "Feed Pigs" exists for Monday', null, { page }); 
    await And('a sprint is already generated for this week', null, { page }); 
    await When('I rename the sprint ticket "Feed Pigs" to "Feed Pigs (Late)"', null, { page }); 
    await Then('the sprint ticket title is "Feed Pigs (Late)"', null, { page }); 
    await But('the Cycle template "Feed Pigs" remains unchanged', null, { page }); 
  });

  test('Cycle changes do not affect existing sprints', async ({ Given, When, Then, But, page }) => { 
    await Given('a sprint is already generated for this week', null, { page }); 
    await When('I create a new Cycle template "New Task" for this Friday', null, { page }); 
    await Then('the current sprint does NOT show "New Task" on Friday', null, { page }); 
    await But('the next generated sprint WILL show "New Task"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/02_sprint_management.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":4,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given it is Monday \"2025-12-01\"","stepMatchArguments":[{"group":{"start":13,"value":"\"2025-12-01\"","children":[{"start":14,"value":"2025-12-01","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"And no sprint exists for week \"2025-12-01\" to \"2025-12-07\"","stepMatchArguments":[{"group":{"start":26,"value":"\"2025-12-01\"","children":[{"start":27,"value":"2025-12-01","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":42,"value":"\"2025-12-07\"","children":[{"start":43,"value":"2025-12-07","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I visit the board","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then a new sprint is created for \"2025-12-01\" to \"2025-12-07\"","stepMatchArguments":[{"group":{"start":28,"value":"\"2025-12-01\"","children":[{"start":29,"value":"2025-12-01","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":44,"value":"\"2025-12-07\"","children":[{"start":45,"value":"2025-12-07","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And the board displays the tab for \"2025-12-01\"","stepMatchArguments":[{"group":{"start":31,"value":"\"2025-12-01\"","children":[{"start":32,"value":"2025-12-01","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And Cycle templates for this week are instantiated as tickets","stepMatchArguments":[]}]},
  {"pwTestLine":15,"pickleLine":12,"tags":[],"steps":[{"pwStepLine":16,"gherkinStepLine":13,"keywordType":"Context","textWithKeyword":"Given a sprint exists for \"2025-12-01\" to \"2025-12-07\"","stepMatchArguments":[{"group":{"start":20,"value":"\"2025-12-01\"","children":[{"start":21,"value":"2025-12-01","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":36,"value":"\"2025-12-07\"","children":[{"start":37,"value":"2025-12-07","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"And today is Wednesday \"2025-12-03\"","stepMatchArguments":[{"group":{"start":19,"value":"\"2025-12-03\"","children":[{"start":20,"value":"2025-12-03","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I visit the board","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then the sprint \"2025-12-01\" to \"2025-12-07\" is loaded","stepMatchArguments":[{"group":{"start":11,"value":"\"2025-12-01\"","children":[{"start":12,"value":"2025-12-01","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":27,"value":"\"2025-12-07\"","children":[{"start":28,"value":"2025-12-07","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"And the tab \"2025-12-03\" (Wednesday) is selected by default","stepMatchArguments":[{"group":{"start":8,"value":"\"2025-12-03\"","children":[{"start":9,"value":"2025-12-03","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":23,"pickleLine":19,"tags":[],"steps":[{"pwStepLine":24,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"Given a Cycle template \"Feed Pigs\" exists for Monday","stepMatchArguments":[{"group":{"start":17,"value":"\"Feed Pigs\"","children":[{"start":18,"value":"Feed Pigs","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":25,"gherkinStepLine":21,"keywordType":"Context","textWithKeyword":"And a sprint is already generated for this week","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I rename the sprint ticket \"Feed Pigs\" to \"Feed Pigs (Late)\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Feed Pigs\"","children":[{"start":28,"value":"Feed Pigs","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":42,"value":"\"Feed Pigs (Late)\"","children":[{"start":43,"value":"Feed Pigs (Late)","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"Then the sprint ticket title is \"Feed Pigs (Late)\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Feed Pigs (Late)\"","children":[{"start":28,"value":"Feed Pigs (Late)","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"But the Cycle template \"Feed Pigs\" remains unchanged","stepMatchArguments":[{"group":{"start":19,"value":"\"Feed Pigs\"","children":[{"start":20,"value":"Feed Pigs","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":31,"pickleLine":26,"tags":[],"steps":[{"pwStepLine":32,"gherkinStepLine":27,"keywordType":"Context","textWithKeyword":"Given a sprint is already generated for this week","stepMatchArguments":[]},{"pwStepLine":33,"gherkinStepLine":28,"keywordType":"Action","textWithKeyword":"When I create a new Cycle template \"New Task\" for this Friday","stepMatchArguments":[{"group":{"start":30,"value":"\"New Task\"","children":[{"start":31,"value":"New Task","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":34,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"Then the current sprint does NOT show \"New Task\" on Friday","stepMatchArguments":[{"group":{"start":33,"value":"\"New Task\"","children":[{"start":34,"value":"New Task","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":35,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"But the next generated sprint WILL show \"New Task\"","stepMatchArguments":[{"group":{"start":36,"value":"\"New Task\"","children":[{"start":37,"value":"New Task","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end