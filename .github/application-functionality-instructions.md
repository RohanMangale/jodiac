## Context

* The application is a web app designed to use by young couples who go on a arranged marraige date.
* The applications purpose is to guide both the boy and girl to ask better questions and provide them a compatibility scroes
* The questions are grouped by various categories. Like career, kids, travelling, finance, personality etc.
* Each category would have some set of question. 
* Each question will be answered by both of them.
* Based on how good the answer matches the user will rate that answer out of 10, 1 being the answers least matching and 10 being the answer matches well.
* Each category will have a weightage between 1 to 5, Where 1 is least important and 5 being the most important.
* We will use this weightage to multiple the rating inorder.
* At the end we will show a compatibility percentage 

** Note: The above calculation might need review. So treat it as temporary.


## Screens

### Landing page
* Landing page will be the first page when some people will see when they visit this site for the first time.
* There will be a top bar on the top left will be the app name Jodiac
* In the middle of the screen there will be a headline and benith it a "Get Started" 


### User detail
* Once user clicks get started page he will be drirected to this page.
* Here a card will open with a simple form for getting users name and if he is a guy or a girl.
* save this info in state
* A next button which takes user to the home page and also saves the info added by user in user in the localstorage

### Home page
* Greet user by saying welcome <user>
* "Add dates" button in the middle of the screen 
* Below Add dates button all the dates added by users will be displayed in date cards
    - Date card should show the name of the date, Date of the date, And the compatibility score in percetnage.

## Add a date
* when user clicks on add date page a new card opens with a form.
* fields on the form
    - Date's name
    - Date (calender)
    - Save button


**Note** more screen needs to be added. But for now we will build only these screens

