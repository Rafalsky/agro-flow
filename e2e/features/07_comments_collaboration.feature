Feature: Comments and Collaboration

    Background:
        Given I am logged in as a "Worker"

    Scenario: Adding a comment to a ticket
        Given a ticket "Difficult Task" exists
        When I open ticket "Difficult Task"
        And I type "Need help with this" in the comment box
        And I click "Send"
        Then the comment "Need help with this" appears in the ticket history
        And "Zootechnician" can see the comment
