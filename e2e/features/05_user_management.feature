Feature: User Management

    Background:
        Given I am logged in as "Zootechnician"

    Scenario: Listing users
        When I visit "/users"
        Then I see a list of all registered workers and zootechnicians

    Scenario: Creating a new user
        When I click "Add User"
        And I enter Name "New Worker" and Email "new@agro.flow"
        And I select role "Worker"
        And I submit the form
        Then the user "New Worker" is added to the system
        And I can use "new@agro.flow" to log in
