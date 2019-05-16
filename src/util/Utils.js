
class ArrayUtil {
    static hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    static remove(array, element) {
        const index = array.indexOf(element);
        array.splice(index, 1);
    }

    static removeAtIndex(array, index) {
        array.splice(index, 1);
    }

}

var Reflux = require('reflux');
var XMLWriter = require('xml-writer');
var fs = require('file-system');


export { ArrayUtil, Reflux, XMLWriter, fs }