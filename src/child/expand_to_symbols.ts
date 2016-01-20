import {IResultSelection, getResult, escapeRegExp} from '../baseexpander';
export function expand_to_symbols(text: string, startIndex: number, endIndex: number): IResultSelection {
    const opening_symbols = "([{";
    const closing_symbols = ")]}";
    const symbols_regex = /[\(\[\{\)\]\}]/;
    const symbols_regexGlobal = /[\(\[\{\)\]\}]/g;
    const quotes_regex = /(['\"])(?:\\.|.)*?\1/g;
    let quotes_blacklist = {};
    //   # get all quoted strings and create dict with key of index = True
    //   # Example: f+"oob"+bar
    //   # quotes_blacklist = {
    //   #   2: true, 3: true, 4: true, 5: true, 6: true
    //   # }
    var r;
    while ((r = quotes_regex.exec(text)) != null) {
        let quotes_start = r.index;
        let quotes_end = quotes_regex.lastIndex;
        let i = 0;
        while (i < text.length) {
            quotes_blacklist[quotes_start + i] = true;
            i += 1;
            if (quotes_start + i == quotes_end) {
                break;
            }

        }
    }
    const counterparts = {
        "(": ")",
        "{": "}",
        "[": "]",
        ")": "(",
        "}": "{",
        "]": "["
    };
    //# find symbols in selection that are "not closed"
    let selection_string = text.substring(startIndex, endIndex);
    let selection_quotes = selection_string.match(symbols_regexGlobal) || [];
    let backward_symbols_stack = [];
    let forward_symbols_stack = [];
    //selection_quotes.map()

    if (selection_quotes.length != 0) {
        let inspect_index = 0;
        // # remove symbols that have a counterpart, i.e. that are "closed"
        while (true) {
            let item = selection_quotes[inspect_index];
            if (item && selection_quotes.indexOf(counterparts[item]) != -1) {
                selection_quotes.splice(inspect_index, 1);
                selection_quotes.splice(selection_quotes.indexOf(counterparts[item]), 1);
            }
            else {
                inspect_index = inspect_index + 1;
                if (inspect_index >= selection_quotes.length)
                    break;
            }
        }
        //# put the remaining "open" symbols in the stack lists depending if they are
        ///# opening or closing symbols
        selection_quotes.forEach(item=> {
            if (opening_symbols.indexOf(item) !== -1) {
                forward_symbols_stack.push(item);
            } else if (closing_symbols.indexOf(item) !== -1) {
                backward_symbols_stack.push(item);
            }
        });

    }
    let search_index = startIndex - 1;
    let symbols_start = 0, symbols_end = 0;
    var symbol;
    //# look back from begin of selection
    while (true) {
        //# begin of string reached
        if (search_index < 0) return null;
        //# skip if current index is within a quote
        if (quotes_blacklist[search_index]) {
            search_index -= 1;
            continue;
        }

        let char = text.substring(search_index, search_index + 1);

        let r = symbols_regex.exec(char);
        if (r) {
            symbol = r[0];
            if (opening_symbols.indexOf(symbol) !== -1 && backward_symbols_stack.length == 0) {
                symbols_start = search_index + 1;
                break;
            }
            if (backward_symbols_stack.length > 0 && backward_symbols_stack[backward_symbols_stack.length - 1] === counterparts[symbol]) {
                //# last symbol in the stack is the counterpart of the found one
                backward_symbols_stack.pop();
            } else {
                backward_symbols_stack.push(symbol);
            }
        }
        search_index -= 1;
    }
    let symbol_pair_regex = new RegExp(`[${escapeRegExp(symbol + counterparts[symbol])}]`);
    forward_symbols_stack.push(symbol);
    search_index = endIndex;
    //# look forward from end of selection
    while (true) {
        //# skip if current index is within a quote
        if (quotes_blacklist[search_index]) {
            search_index += 1
            continue;
        }
        let character = text.substring(search_index, search_index + 1)
        let result = symbol_pair_regex.exec(character)
        if (result) {
            symbol = result[0];
            if (forward_symbols_stack[forward_symbols_stack.length - 1] == counterparts[symbol]) {
                //# counterpart of found symbol is the last one in stack, remove it
                forward_symbols_stack.pop()
            }
            else {
                forward_symbols_stack.push(symbol)
            }

            if (forward_symbols_stack.length == 0) {
                symbols_end = search_index;
                break
            }
        }
        //# end of string reached
        if (search_index == text.length) {
            return
        }
        search_index += 1
    }
    if (startIndex == symbols_start && endIndex == symbols_end)
        return getResult(symbols_start - 1, symbols_end + 1, text, "symbol");
    else
        return getResult(symbols_start, symbols_end, text, "symbol");

}
