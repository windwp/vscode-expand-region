[![Build Status](https://travis-ci.org/windwp/vscode-expand-region.svg?branch=master)](https://travis-ci.org/windwp/vscode-expand-region)
# vscode-expand-region
porting sublime-expand-region to visual code
https://github.com/aronwoost/sublime-expand-region

### Only support javascript and html now ,it will support python and latex in a future

### JavaScript
![](https://raw.githubusercontent.com/windwp/vscode-expand-region/master/image/javascript.gif)
1. Expand selection to word
2. Expand selection to quotes (content only)
3. Expand selection to quotes (with quotes)
4. Expand selection to square braces
5. Expand selection to expression
6. Expand selection to content of braces (all arguments in this case)
7. Expand selection to line
8. Expand selection to function body (w/o curly brace)
9. Expand selection to function body (with curly brace)

and so on...


### HTML/PHP

![](https://raw.githubusercontent.com/windwp/vscode-expand-region/master/image/html.gif)

1. Expand selection to word
2. Expand selection to quotes (content only)
3. Expand selection to quotes (with quotes)
4. Expand selection to complete self closing tag
5. Expand selection to parent node content
6. Expand selection to complete node
7. Expand selection to parent node content

and so on...


## Using
- Set a keyboard shortcut.
  Open "Key Bindings" and add following code:
``` js
{
    "key": "ctrl+w","command": "expand_region", "when": "editorTextFocus"
},
{
    "key": "ctrl+shift+w","command": "undo_expand_region", "when": "editorTextFocus && editorHasSelection"
}
```
## development
1. npm install
2. npm compile (compile typescript)
3. npm test:watch (run mocha for test)

# Changelog
## 0.1.2
 * support php

## 0.1.0
  * support multi cursor
  * fix issue #10 #7

## 0.0.2
  * add feature undo_expand_region
## 0.0.1
  * first release
