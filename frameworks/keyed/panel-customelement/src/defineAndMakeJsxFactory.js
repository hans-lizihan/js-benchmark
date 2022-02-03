import { jsx } from 'panel';
/**
 * JSON.stringify objects and arrays in attrs since dom attributes can only have simple string values
 */
function stringifyAttrsIfPojo(attrs) {
    // see https://jsperf.com/object-keys-vs-for-in-with-closure/3
    // Object.keys is faster than for-in -> .hasOwnProperty
    const attrKeys = Object.keys(attrs);
    for (let i = 0, len = attrKeys.length; i < len; ++i) {
        const attr = attrKeys[i];
        const attrValue = attrs[attr];
        // typeof null = 'object' is a common pitfall, so we gotta check for that
        if (attrValue !== null && typeof attrValue === `object`) {
            // only stringify plain objects or arrays
            const constructor = attrValue.constructor;
            if (constructor === Object || constructor === Array) {
                attrs[attr] = JSON.stringify(attrValue);
            }
            else {
                throw new Error(`cannot JSON.stringify attr:'${attr}' with value:${attrValue}, only plain objects and arrays allowed`);
            }
        }
    }
    return attrs;
}
/**
 * defines a custom element via customElement.define
 * and returns a jsx factory function that auto JSON.stringify-ies POJO attrs
 */
export default function defineAndMakeJsxFactory(customElementName,
customElementClass) {
    // register with customElements registry if not already defined
    if (!customElements.get(customElementName)) {
        customElements.define(customElementName, customElementClass);
    }
    return function (props, children) {
        if (props === null || props === void 0 ? void 0 : props.attrs) {
            props.attrs = stringifyAttrsIfPojo(props.attrs);
        }
        return jsx(customElementName, props, children);
    };
}
