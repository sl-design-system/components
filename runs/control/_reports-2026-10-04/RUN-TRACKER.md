# Control runs tracker — target: 19 cases x 2 passes = 38 runs

Scheduling constraint: the skill derives its work folder from the FIGMA FILE name, so two runs
on the same file must never be in flight together or they race for the same `-N`.

| #   | Case                        | Figma file           | Pass 1              | Pass 2       |
| --- | --------------------------- | -------------------- | ------------------- | ------------ |
| 1   | B-Itsl-Course course files  | Course-files         | DONE halt CC        | DONE halt CC |
| 2   | A9 SANNA Login              | SANNA                | DONE complete       | in flight    |
| 3   | A7 Bingel Materials         | MyPortal             | DONE halt CC        | in flight    |
| 5   | A8 NSP Group list           | New-Secondary        | DONE halt CC        | DONE halt CC |
| 6   | A2 NSP class overview       | NS-fundaments        | DONE halt MCP       | DONE halt CC |
| 7   | A10 ETSL FAM Users          | Editorial-Suite      | DONE halt CC        | DONE halt CC |
| 9   | A11 Sesame Learning         | MySesame             | DONE halt CC        | DONE halt CC |
| 10  | A6 Itsl-Collab Shared       | Collaboration-folder | DONE halt CC        | DONE halt CC |
| 11  | A1 Kampus Subchapter        | New-content-view     | DONE halt CC        | DONE halt CC |
| 14  | B-Itsl-Bookmk Deleted       | Bookmarks            | DONE halt CC        | DONE halt CC |
| 8   | B-NSP home                  | NS-fundaments        | in flight           | TODO         |
| 12  | B-Sesame Group details      | MySesame             | in flight           | TODO         |
| 15  | B-Itsl-Collab Add element   | Collaboration-folder | in flight           | TODO         |
| 16  | B-Itsl-Bookmk course files  | Bookmarks            | in flight           | TODO         |
| 18  | A5 ETSL Metadata widget     | Editorial-Suite      | in flight           | TODO         |
| 19  | B-Kampus Notes panel        | New-content-view     | in flight           | TODO         |
| 4   | B-SANNA Account creation    | SANNA                | BLOCKED on #2 pass2 | TODO         |
| 13  | A3 Bingel Digital Exercises | MyPortal             | BLOCKED on #3 pass2 | TODO         |
| 17  | A4 Sesame My Groups         | MySesame             | DONE halt CC        | TODO         |

## Launch order remaining

1. When A9 r2 finishes -> launch #4 B-SANNA pass 1
2. When A7 r2 finishes -> launch #13 A3 Bingel pass 1
3. When #12 B-Sesame pass 1 finishes -> launch #17 A4 Sesame pass 1
4. Then pass 2 for all nine of #4, #8, #12, #13, #15, #16, #17, #18, #19,
   grouped so no two share a Figma file:
   - wave A: #8, #12, #15, #16, #18, #19
   - wave B: #4, #13, #17

Pass 1 reports -> scratchpad/control-results/
Pass 2 reports -> scratchpad/control-results-pass2/
