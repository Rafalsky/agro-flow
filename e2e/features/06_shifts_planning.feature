Feature: Shifts Planning

    Background:
        Given I am logged in as "Zootechnician"

    Scenario: Scheduling Shifts
        When I visit "/shifts" (or planning view)
        And I select "Worker A"
        And I assign a shift for "2025-12-05" from "08:00" to "16:00"
        And I save the changes
        Then "Worker A" sees their shift on the board or calendar for "2025-12-05"

    Scenario: Viewing Shifts
        When I view the shifts for week "2025-12-01"
        Then I see all assigned shifts for all workers
