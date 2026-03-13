# Select match play

Next up, allow user to submit his own result.

## Requirements
- url to custom Metrix competition:
  - Metrix id ("3541752" in url "https://discgolfmetrix.com/3541752")
  - Metrix url (e.g https://discgolfmetrix.com/3541752, discgolfmetrix.com/3541752)
    - domain must be discgolfmetrix.com
- scores only for two players
  - if competition has more than two players, use the two first
  - if competition has less than 2 players, abort with error message


## Implementation

We have already replaced player images with generic images for player 1 and player 2.

Next, we need to allow the user to submit own scores and player names.

Below the "BEGIN" button, add "CREATE" buttton, which shows a form with the following fields:
- Disc Golf Metrix url or id
  - make sure you follow the rules regarding url defined in the "Requirements" section
- Player 1
- Player 2

Below the fields add a submit button "SUBMIT". Pressing this button has the same effect as the 
current "BEGIN" button.

Make the form follow the retro styles. When the form is visible, hide the player images etc. The
scrolling background can stay. When the form is displayed, use a smooth transition effect (use
similar effect when hiding the form). The form may take up almost whole page area.


## Improvements

There is one match play hard-coded, which is used if user clicks on the "BEGIN" button.

This is ok, but when on the intro page, use "Player 1" and "Player 2" instead of the hard coded 
player's names. Actual names should come from the metrix url. 

Rename "BEGIN" to "ANTTI vs ESKO". Users can watch it if they don't want to add an own.

