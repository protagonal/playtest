## Playtest

Playtest is a card game printer. It takes tabular card specification format as input and prints pages of numbered and versioned cards in the correct quantities so they can be play tested.


### Deck Spec

Card decks are described using a table of information about each card. The first row of the table names each column. Each following row of the table represents a single unique card. 

```
type,cost
knave,$1
queen,$3
wizard,$5
```

In the example, column names are `type` and `cost`. Columns of the table can be anything you want, but there are a couple of column names that have special meaning.

* `quantity` specifies the number of that card type that will be in the deck. If the table does not include a `quantity` column, then one card of each type will be included in your deck.

```
type,cost,quantity
knave,$1,5
queen,$2,2
wizard,$5,1
```

In the example, Playtest would print five copies of knave, two copies of queen, and one wizard.

* `layers` specifies which named svg groups should be displayed. If a `layers` column is present, all layers are hidden unless explicitly listed in a given row. Multiple layers should be delimited by the pipe symbol (`|`).

```
type,cost,quantity,layers
knave,$1,5,base
queen,$2,2,base|queen
wizard,$5,1,base
```

In the example, only the layer titled `base` would display for the knave card and wizard card, but the queen card would have `base` and `queen` layers displayed.

### Card Design

Playtest card designs are specified in a single SVG file with multiple layers. The deck specification determines which layer is shown when each card is printed. Text labels in the SVG may also include template values that Playtest will substitute for column values.  The template has this format: `{{ column_name }}`.

### User Interface

The latest version of this project is hosted [here](http://playtest.meteor.com).

#### Quirks

* Each unique card is displayed at the top under "Cards". Click on the card to open an in-browser SVG editor. Changes made in this editor must be saved by clicking SVG Edit -> Save Image, or they'll be lost when you click on another card (or reload the page).
* The text box on the bottom on the left labeled "Deck" is the deck specification as described above. Click outside the text box after making changes to save them.
* The text box on the bottom on the right labeled "Design" is the SVG card design. It's for debugging. As with the deck specification, click outside after making changes to save them.
* If you are not logged in, any new games are public and show up in everyone's list. If you're logged in, any new games you create are private and only accessible to you.

### TODO

- print diffs, to save time when tweaking game rules
- automatically show odds of drawing various cards and card combinations
- google docs API integration
