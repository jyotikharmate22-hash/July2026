Feature: Login
@regression
  Scenario: Successful login to OrangeHRM
    Given User navigates to OrangeHRM Login page
    When User enters username "Admin"
    And User enters password "admin123"
    And User clicks Login button
    Then Dashboard should be displayed
