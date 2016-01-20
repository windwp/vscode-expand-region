
# vscode-expand-region
porting sublime-expand-region to visual code 
https://github.com/aronwoost/sublime-expand-region

### JavaScript 
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


### HTML

![](http://aronwoost.github.io/expand-to-html.gif)

1. Expand selection to word
2. Expand selection to quotes (content only)
3. Expand selection to quotes (with quotes)
4. Expand selection to complete self closing tag
5. Expand selection to parent node content
6. Expand selection to complete node
7. Expand selection to parent node content

and so on...


## Using
- Set a shortcut.
  Open "Key Bindings" and add to following line: 
``` js
{
    "key": "ctrl+w","command": "expand_region"
}
```

### Don't support python and latex now
