Feature: user Authentication and Authorization

    Background:
        Given I am on the login page

    Scenario: Zootechnician logs in with magic link
        Given a user "Zootechnician" exists with email "zootech@agro.flow"
        When I enter email "zootech@agro.flow"
        And I click "Send Magic Link"
        And I visit the magic link sent to "zootech@agro.flow"
        Then I am redirected to the board
        And I see "Zootechnician" controls

    Scenario: Worker logs in with magic link
        Given a user "Worker" exists with email "worker@agro.flow"
        When I enter email "worker@agro.flow"
        And I click "Send Magic Link"
        And I visit the magic link sent to "worker@agro.flow"
        Then I am redirected to the board
        And I see "Worker" view (limited controls)

    Scenario: Unregistered user cannot log in
        Given no user exists with email "random@hacker.com"
        When I enter email "random@hacker.com"
        And I click "Send Magic Link"
        Then I see an error message "User not found"

    Scenario: Access Denied for unauthorized roles
        Given I am logged in as a "Worker"
        When I attempt to visit "/users"
        Then I am redirected to "/board" or see "Access Denied"
