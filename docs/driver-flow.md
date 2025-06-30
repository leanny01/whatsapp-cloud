# Driver Application Flow Documentation

## Summary

The Driver Application Flow allows users to register as drivers, check the status of their applications, and manage their driver profile via WhatsApp. The process is comprehensive and user-friendly.

## Flow Diagram

```mermaid
graph TD
  Menu["Driver Main Menu"]
  Register["1️⃣ Register as Driver"]
  Status["2️⃣ Check Application Status"]
  Back["3️⃣ Back to Main Menu"]

  RegisterStart["Start Driver Registration"]
  Name["Name"]
  Phone["WhatsApp Phone Number"]
  CallNumber["Call Number"]
  Address["Home Address"]
  License["License Number"]
  Vehicle["Vehicle Details"]
  Ownership["Ownership"]
  CompanyReg["Company Registration"]
  CompanyName["Company Name"]
  VehiclePhotos["Vehicle Photos"]
  MoreVehicles["Add More Vehicles?"]
  Experience["Years of Experience"]
  Team["Works Alone or Team?"]
  Routes["Common Routes"]
  Specialization["Specialization"]
  OtherActivities["Other Activities"]
  IDPhoto["ID/Passport Photo"]
  LicensePhoto["License Photo"]
  Review["Review Application"]
  Edit["Edit Info?"]
  Submit["Submit Application"]
  Submitted["Application Submitted!"]
  StatusMenu["Show Application Status List"]

  Menu --> Register
  Menu --> Status
  Menu --> Back
  Register --> RegisterStart
  RegisterStart --> Name
  Name --> Phone
  Phone --> CallNumber
  CallNumber --> Address
  Address --> License
  License --> Vehicle
  Vehicle --> Ownership
  Ownership --> CompanyReg
  CompanyReg --> CompanyName
  CompanyName --> VehiclePhotos
  VehiclePhotos --> MoreVehicles
  MoreVehicles --> Experience
  Experience --> Team
  Team --> Routes
  Routes --> Specialization
  Specialization --> OtherActivities
  OtherActivities --> IDPhoto
  IDPhoto --> LicensePhoto
  LicensePhoto --> Review
  Review --> Edit
  Edit -->|Edit| Name
  Edit -->|Submit| Submit
  Submit --> Submitted
  Status --> StatusMenu
```

## Step-by-Step Breakdown

1. **Main Menu**: User chooses to register as a driver, check application status, or return to the main menu.
2. **Register as Driver**: User is guided through a comprehensive registration process:
   - Name, phone, call number, address, license, vehicle details, ownership, company info, photos, experience, team, routes, specialization, other activities, document uploads, review, and submit.
3. **Check Application Status**: User can view a list of all their applications and their statuses.

## Future Expansion

- FAQ
- Troubleshooting
- User tips
