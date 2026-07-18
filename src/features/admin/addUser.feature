Feature: Add New System User

  Scenario: Successfully create a new system user
    Given User launches OrangeHRM application
    And User logs in as Admin
    When User clicks Admin menu
    And User clicks Add button
    And User selects User Role as Admin
    And User enters Employee Name
    And User waits for autocomplete suggestions
    And User selects first matching employee
    And User selects Status as Enabled
    And User enters unique Username
    And User enters Password
    And User enters Confirm Password
    And User clicks Save button
    Then User should see success message
    And Newly created user should appear in User Management list
