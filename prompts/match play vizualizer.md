# Match play vizualizer

Context: Disc golf, match play

Enter plan mode. Read through the specs. As this web app is animation heavy, consider using modern
libraries that make it easier to create transitions and animations.

Split the tasks into logical steps. After each step the web app should be in working order.
Present the results after each step and I'll review it in the browser.

We can discuss required changes before continuing with the next step.

If unsure about anything, verify rather than guess.


## Tech stack
- Vite
- React 19
- Typescript
- use port 5133
- .nvmrc with proper node version

## Git setup

- repository: https://github.com/janimattiellonen/match-play-vizualizer
- initialize git repository and add a README.md file


## Style

- use retro styled animations with bright colors (purple, pink, yellow, red)
- use high contrast colors (light vs bright colors)
- if you can, see data/retro.png for a hint of what I'm looking for

## Example players and scores

For starters, let's use some example players:

Player 1:
- name: Antti Kärpijoki
- image: data/players/player-1.jpeg

Player 2:
- name: Esko Perkko
- image: data/players/player-2.jpeg

In this initial example, simulate a match play between these two players on a 18-hole match.
Simulate scores for each player and hole. Make player 1 win. Keep the randomized scores for each
hole between 2 and 5.

## Specs

A web app for displaying results of a match play between two players.

The results should be shown hole by hole in a very graphical and stylish way with big animations.

Initially the page displays an image of both players, side by side with a big "VS" between them.

Below each player a score is displayed. Initially "0".

Player on the left side is considered player 1 and the other is player 2.

Below the images is a "Begin" button.

When pressed, a big semi-translucent rounded box is drawn in front of everything with a countdown
from 3 to 0. A delay of 1s between each number.

When the countdown is finished, the countdown box vanishes with a fade-away animation.

The results are displayed below the player images in a table styled structure:
```
player     | #1 | #2 | #3 | ...
----------------------------
Steve Jobs | 6  | 3  | 5  | ... 
Bill Gates | 4  | 4  | 3  | ...
```
Results of each hole is displayed one by one. The hole numbers can be initially visible, the 
scores are just empty. Always show, which hole is currently presented. Add each player's score 
for the current hole individually and with a slight delay. Use an animation.

After both player's scores have been added for the current hole, highlight the bigger score for 
a moment.

The hole winning player's image is animated with a "victorious" effect. After the 
animation has ended, increase the score for the player winning that hole. Make the increase 
animated.


The score presentation continues as long as there are scores to present. When all holes and scores 
have been processed and the winner is confirmed, highlight the winner (image and score) for a 
while. Then, animate the winner by increasing the size of the  winning player's image while 
moving the image towards the center of the page. When the animation is finished, show the text  
"WINNER!" above the player's image. The color of the "WINNER!" text should be golden and the text 
should be animated (pulsating effect).




## Improvements

- use correct names as given for each player
- replace simulated scores with actual scores

### Instructions for fetching actual scores

Match play url: https://discgolfmetrix.com/api.php?content=result&id=3541752

Response structure:

Competition
    Results (array)
        - one item per player
            PlayerResults
                - one item per hole


We will later on use same API for retrieving scores, so you can create a simple API client that 
can fetch results and construct a scores structure for the web app.


## Improvements, round 2

When all scores have been presented, the winning player is highlighted for a moment and then the
losing player's image is moved to the right. THis movement is too jerky. It should be smoother.

Show a "Back" button in the end so that the user can go back.

Can you temporarilly speed up the process that shows the scores so that I don't have to wait 
so long to see whether the improvements work or not.