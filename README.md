## SIAM: 25-08-2025
- create pgtowtowotmgoods and details page with complete ui

## SIAM: 24-08-2025
- AllEgpListedCOmpany, CompanyMigrations, UsersCompanyMigrations, JobOrder, MyJobOrder mobile table layout added.
- fixed bottom navigation space issue

## SIAM: 23-08-2025
- complete the dashboard sidebar with fully responsive functionality
- fixed live tenders table filter ui
- created dashboard recent order table mobile layout


## SIAM: 22-08-2025
- created live tenders table mobile layout





## 4-5-2025
- created all api (get all ,get single, create, update, delete) for tutorials category
- implemented functionality to remove duplicate word from sub-categories
- created page to add tutorial category
- created hooks to get all tutorial category and displayed in data-table
- created update form to update category 
- while updating removed duplicate word from sub-categories
- implemented Delete Functionality

## 4-5-2025
- create public route for create-tender, update-secondary-tender-form, tender-ids, tenders(need to update)
- remove all inactive routes from dashboard sidebar
### update-tender(secondary)
- convert tenderCategory field to selectedTenderCategory
- filtering with selectedTenderCategory instead of tenderCategory
### tenders(need to update)
- added field to data table (descriptionOfWorks, selectedTenderCategory, tds, identificationOfLot, qualityCriteria. )
### create-tender(master-form)
- added quality criteria in form also in backend schema
- convert date fields to text field (openingDate, lastSelling, publicationDate)


## 3-5-2025
- update update-tender(secondary) form
- update tender schema in back-end
- create api (get all, get single, create, delete, update) for department
- create hook to get all departments and displayed in ui
- create hook to get all unique organization
- create department creation form and update form
- implemented update and delete functionality for departments
- modify tender creation form and remove duplicate word from tds field

## 1-5-2025
### Account Holder
- implemented creating unique egp mail for unique account holder
### All Tender
- Made tender stats section dynamic by creating api in back-end
- resolve search issue with All Tender
- modify data-entry table

### line-of-credit
- top-bottom (min-5)
- Credit amount(liquide_Asset)
- reduce_line break of 1st paragraph
- justify text
- missing-packageNo and tenderId
- officialDesignation(after-to)
- organization, locationDistrict
- alnogside Credit Commitment No: current date in right side (date, month, year)
- Works Viz: description

all-tender(dynamic-static)
dashboard-sidebar nested will be open when click parent
after clicking the route side will be close

## 30-4-2025
- created tender update form and api in the backend
- created api to get tenderIds that did not match to tenderId in tender collection
- created hook to get tenderIds
- created page to show tenderIds and implemented search and filtering
- implemented pagination in tenderIds page

## 29-4-2025

- created api (get single, delete , update) account Holder
- created table to show all account created by user
- created page to update account info and implemented delete functionality
- created function to covert credit amount number to words
- nested will be open when click parent

### credit-line-modification

- line-of-credit
- top-bottom-margin(min5)
- Credit amount(liquid_Asset)
- reduce_line break of 1st paragraph
- justify text
- missing-packageNo and tenderId
- officialDesignation(after-to)
- organization, locationDistrict
- alongside Credit Commitment No: current date (date, month, year)
- Works Viz: description

## 28-4-2025

- Implemented validation to prevent the same user from creating multiple 'Account Holder Details' with the same egpMail.
- Developed an API to retrieve all 'Account Holder Details' for a specific user.
- Created a custom React hook and a combobox component to fetch and select a user's egpMail.
- Added functionality and input fields to manage margins separately.
- Built functionality to add a credit line.
- Developed a feature to generate and print PDFs.

## 21-4-2025

- created api to format tender data to send
- created hook to get formatted tender and displayed in ui
- added pagination to reduce render time
- implemented functionality for creating tenderID and Send to another website
- resolve issue with archive tenders

## 20-4-2025

- create api to make payment and update user wallet balance
- created page to create payment
- resolve issue with deadline in recent order in ata-glance
- resolve issue with archive tender

## 19-4-2025

- resolve issue with rendering users
- created api get LMT_License_SL for by-pass-report
- created functionality to render reLogin
- created page for updating jobNo status
- refactor dashboard layout
- resolve issue with Duplicating JobNo

## 18-4-2025

- created api for by-pass-report
- created form for by-pass-report
- create hook to get by-pass-report
- add create-order button in tender details page
- resolve issue with SLOFCredit line in JobOrder

## 17-4-2025

- modify LTM tender table
- create function to formate date in tender details page
- resolve navigation issue in at-a-glance page
- made correction of BKash Information in Payment Page
- find company name by Egp mail and showed in recent order table
- resolve issue with showing data when string is received in a Number filed in tender Details Page
- resolve issue with clearing form after creating job order
- created a schedular function to store 'failed opening date' tenders into archived tenders

## 16-4-2025

- created api for specific method's tenders
- created hook for specific method's tenders
- created LTM tenders page and implemented all filtration
- created payment page
- created logout button for small device in dashboard sidebar
- resolve some design issue in at-a-glance page and live tenders page

## 15-4-2025

- refactor all-tenders schema for pagination
- created pagination component
- resolve responsive issue in all-tender page
- resolve issue with filter by date
- resolve date formatting issue in live tenders page
- created dynamic page for tender

## 14-4-2025

- resolve issue with updating egp-listed company
- resolve issue with input field
- showed tender count and navigate to tender page from at-a-glance page
- showed Job Order count and navigate to cart from at-a-glance page
- filter all inActive migration and showed count in at-a-glance page
- created api to get counts for waiting, working, canceled, and fulfilled statuses job order
- created hook to get all different status job migration and displayed in at a glance page
- created api to get user recent order with tenderId lookup
- create hook to fetch recent orders and displayed in at-a-glance page

## 13-4-2025

- created two different api to get unique department and categories
- refactor getAllTenders api to filter by department and categories
- created two different hooks to get all unique department and categories
- created two different comboBox to display department and categories and implemented filtering
- created location comboBox with districts and implemented filtering with location
- covert job order page to Private route
- created different api and hook to fetch user job order only
- created MyJobOrder page for every user

## 11-4-2025

- re-factor tender create form( convert publicationDateTime, documentLastSelling, openingDateTime from text field to date-picker )
- view details showed in modal instead of another page
- created date picker component to filter tenders by date
- created tenderSource combobox to filter tenders by method
- refactor tender getting function for filtering by date and method in server
- made live tenders page user's route

## 10-4-2025

- create all api for tender (get, single get, create, update, delete)
- implement search functionality
- create tender crete page
- create tender data table page and hook to fetch all tenders
- create tender details page

## 9-4-2025

- re-factor jobOrderCart schema. WIth each document a property(status) will be added
- re-factor jobOrder schema, each order will store in array
- re-factor get api for jobOrder. fetch individual jobOrders items using aggregation with search support
- implement status update for nested jobOrders by jobId using arrayFilters

## 8-4-2025

- after checkout a jobOrder will be created
- with each jobCreating a unique value will generated. A function will check what was the previous orderId. If ther previous one is "1000" next will 1001
- The the orders will be deleted from the cart collection
- after successfully placing the order the the grandTotal price of orders will be deducted from the user's wallet balance
- there will be two disable button in cart page. If the cart is Empty the Proceed to checkout will be disabled and show message "cart is empty" , if grandTotal balance is greater than the wallet balance it will again be disabled.
- in job order form only those egp-mail will be fetched that exists in egpListed company and status in active
- In my registered Company each document's email and password will be compared with egpListed company email and password. If both matches the status and remarks will be rendered if not the value of status and remarks will be 'waiting to migrate...'

## 7-4-2025

- fixed issue with cart item re-rendering
- resolved error in create-job-order page
- re-factor jobOrder schema and JobOrder Form(map_1 will be required instead of map_2)
- re-factor user's cart schema. Service name will be shown instead of service Id

## 6-4-2025

- created api for promo code (get, post, delete)
- created page to create promo code
- created data table for promo code
- calculating discount from promo code in cart
- created wallet for user and displayed in at-a-glance page

## 27-3-2025(company migration)

- created apis in server (get, post , delete, api)
- created data table for company migration with search functionality
- created View Details page for each company migration
- Implemented Delete Functionality for each company migration

## 26-3-2025

- fixing bug with creating data in server
- fixing but with connection server with mongoDB
- creating admin route
- rendering dashboard route according to user role

## 25-3-2025

- create user in data base
- get single user from data base and set user in authProvider
- show all user in dashboard
- navigate user to dashboard if logged In
- create view details for every user
