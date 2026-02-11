Feature: Board Interaction and Ticket Lifecycle

    Background:
        Given I am logged in

    Scenario: Creating an ad-hoc ticket
        Given I am logged in as "Zootechnician"
        When I click "New Ticket"
        And I fill details "Broken Fence" for "Thursday"
        And I click "Create"
        Then the ticket "Broken Fence" appears in "Thursday" column

    Scenario: Worker starts and stops a ticket
        Given I am logged in as "Worker"
        And a ticket "Feed Animals" is assigned to me
        When I click "Start" on "Feed Animals"
        Then the ticket status changes to "In Progress"
        And I see a "Stop" button

        When I click "Stop"
        Then the ticket status changes to "Done"
    
    Scenario: Zootechnician reassigns a ticket
        Given I am logged in as "Zootechnician"
        And a ticket "Cleaning" is assigned to "Worker A"
        When I open the ticket "Cleaning"
        And I change assignee to "Worker B"
        Then "Worker B" sees the ticket in their view
        And "Worker A" no longer sees the ticket (or sees it unassigned from them)

    Scenario: Moving ticket between days
        Given I am logged in as "Zootechnician"
        When I drag ticket "Task A" from "Monday" to "Tuesday"
        Then the ticket "Task A" appears in "Tuesday" column
        And the API updates the ticket date
