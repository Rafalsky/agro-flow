Feature: Cycle Management (Recurring Tasks)

    Background:
        Given I am logged in as "Zootechnician"

    Scenario: Creating a new Cycle Definition
        When I visit "/cycles"
        And I click "New Cycle Task"
        And I enter title "Weekly Vet Check"
        And I select day "Friday"
        And I select time slot "Morning"
        And I click "Save"
        Then I see "Weekly Vet Check" in the list of cycle tasks

    Scenario: Editing a Cycle Definition
        Given a cycle task "Old Name" exists
        When I edit the task to "New Name"
        Then the list shows "New Name"
        But existing sprints are NOT updated (as per Rule 7 in FIX.md)

    Scenario: Deleting a Cycle Definition
        Given a cycle task "Obsolete Task" exists
        When I delete "Obsolete Task"
        Then it is removed from the cycle list
        But existing tickets spawned from this cycle remain in the current sprint
