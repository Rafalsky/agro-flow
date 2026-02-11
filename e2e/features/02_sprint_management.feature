Feature: Sprint and Cycle Logic
    Refers to rules in FIX.md regarding automatic sprint generation and date handling.

    Scenario: System auto-generates sprint for current week on first access
        Given it is Monday "2025-12-01"
        And no sprint exists for week "2025-12-01" to "2025-12-07"
        When I visit the board
        Then a new sprint is created for "2025-12-01" to "2025-12-07"
        And the board displays the tab for "2025-12-01"
        And Cycle templates for this week are instantiated as tickets

    Scenario: Board defaults to current day tab
        Given a sprint exists for "2025-12-01" to "2025-12-07"
        And today is Wednesday "2025-12-03"
        When I visit the board
        Then the sprint "2025-12-01" to "2025-12-07" is loaded
        And the tab "2025-12-03" (Wednesday) is selected by default

    Scenario: Sprint tickets are independent of Cycle templates after generation
        Given a Cycle template "Feed Pigs" exists for Monday
        And a sprint is already generated for this week
        When I rename the sprint ticket "Feed Pigs" to "Feed Pigs (Late)"
        Then the sprint ticket title is "Feed Pigs (Late)"
        But the Cycle template "Feed Pigs" remains unchanged

    Scenario: Cycle changes do not affect existing sprints
        Given a sprint is already generated for this week
        When I create a new Cycle template "New Task" for this Friday
        Then the current sprint does NOT show "New Task" on Friday
        But the next generated sprint WILL show "New Task"
