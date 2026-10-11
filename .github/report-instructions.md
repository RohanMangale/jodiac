we need to add a new function on the show compatibility report button and then it should open a new page which is report page. 

Report page is a reusable card. It will have the compatibility Score at the first.

write now lets focus on saving the report as a object in that date. We will build the UI later. 

i am thinking of saving the report like this

{
    report:{
        overallScore: 66.7,
        evaluatedCount: 18,
        totalQuestions: 27,
        unresolvedQuestions: [
            {
                "question":"",
                "category":"",
            }
        ],
        alignments: [
            {
                "question":"",
                "category":"",
            }
        ],
        differences: [
            {
                "question":"",
                "category":"",
            }
        ],
        dealBreakerConflicts: [
            "questions"
        ],
        categorySummaries: [
            {
                "category":"",
                "status":"Good Alignment"/ "Needs discussion", "Not enough info"
            }
        ],
        reflection: {}
    }
}
