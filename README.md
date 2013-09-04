playtest
========

Playtest is a card game printer. It takes tabular card specification format as input and outputs PDF files of numbered and versioned cards in the correct quantities to be printed and play tested.


Deck Spec
---------

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

In the example, playtest would print five copies of knave, two copies of queen, and one wizard.

* `layers` specifies which named svg groups should be displayed. If a `layers` column is present, all layers are hidden unless explicitly listed in a given row. Multiple layers should be delimited by the pipe symbol (`|`).

```
type,cost,quantity,layers
knave,$1,5,base
queen,$2,2,base|queen
wizard,$5,1,base
```

In the example, only the layer titled `base` would display for the knave card and wizard card, but the queen card would have `base` and `queen` layers displayed.


User Interface
--------------

Modify the table on the left. Changes are reflected as you type in the card deck on the right.


TODO
----

- print diffs, to save time when tweaking game rules
- automatically show odds of drawing various cards and card combinations
- google docs API integration
- save cards
