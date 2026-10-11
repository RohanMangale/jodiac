When user clicks on "take comaplity test" a new page will open up.
The new page will read the src/lib/data/questions.json.
The questions have 3 sets.
    - arrangedMarriage
    - casualDating
    - phoneCallDate
Based on the date_type variable choosed the questions sets should be choosed.
Each sets have a list of questions.
Each question object has id, order, category, question.
The new page shoud have a question counter on top right like 1/30, 2/30 etc.
The new page has a left arrow button on top left of the screen which which one clicked will be a popup card to user saying is the user sure to abort the questionarei.
below the top bar there will be a progress bar use bulma's progress bar to show the progress.
<progress class="progress is-success" value="60" max="100">
  60%
</progress>
after this there will be the question card. This card will be a reuable component.
the card will have the below elements.
- The question
- A expandable card with a light buld icon saying "Need help continuing the conversation" and list the followUps question.
- How much this matters to you. 3 Buttons
    -  Not much (doesnt affect my decision much)
    -  Matters to me (somewhat important)
    -  Matters a lot

- How compatible is thir answer with you
    - Very Compatible - Strong Alignment
    - Compatible - Generally works for me
    - Need to explore - Needs more information
    - Not very compatible - Some meaninigfull differences
    - Highly Incompatible - Major compatibility issues, Red flag

- Is this a deal breaker to you 
    - Yes
    - No

Add a note - when clicked user could add a note about this question.


- Next question button to go to next question.

----
- use bulma classes wherever possible
- use the same primary app colors whereever possible
----


------
Storing the response in the localStorage state. 
-------

We will build this later. lets focus on designing the page first.

