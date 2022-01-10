import * as path from 'path'
import { pathToFileURL } from 'url'
import { $, goto, evaluate } from 'taiko'

import type { CompiledComponent } from './compile'

const emptyHtml = pathToFileURL(path.resolve(__dirname, 'empty.html')).toString()

/**
 * Attaches the component to a web page using Taiko
 * 
 * @param component component to mount
 * @param props Props to pass to the component
 */
export const mount = async (component: CompiledComponent, props: object = {}, slots: Record<string, string> = {}) => {
    await goto(emptyHtml)

    await evaluate($('#root'), (e, args) => {
        const script = document.createElement('script')
        script.type = 'module'
        script.textContent = args.component.js

        /**
         * Svelte does not (yet) allow applying elements to slots in the public API.
         * 
         * A PR is out for adding this capability, and these functions are borrowed from it.
         * See: https://github.com/sveltejs/svelte/pull/5687 
         */
        script.textContent += `
            function create_root_slot_fn(elements) {
                return function () {
                    return {
                        c: noop,
            
                        m: function mount(target, anchor) {
                            elements.forEach(element => {
                                insert(target, element, anchor);
                            });
                        },
            
                        d: function destroy(detaching) {
                            if (detaching) {
                                elements.forEach(detach);
                            }
                        },
            
                        l: noop
                    };
                };
            }

            function createSlot(input) {
                const slots = {};
                for (const key in input) {
                    const nodeOrNodeList = input[key];
                    const nodeList = Array.isArray(nodeOrNodeList) ? nodeOrNodeList : [nodeOrNodeList];
                    slots[key] = [create_root_slot_fn(nodeList)];
                }
                return slots;
            }

            const slots = Object.entries(${JSON.stringify(args.slots)}).reduce((obj, [key, value]) => {
                const d = document.createElement('div');
                d.innerHTML = value;

                return {
                    ...obj,
                    [key]: d.childNodes,
                }
            }, {});

            new ${args.component.name}({
                target: document.getElementById('root'),
                props: Object.assign({}, ${JSON.stringify(args.props)}, {
                    $$scope: {},
                    $$slots: createSlot(slots),
                }),
            })
        `

        document.head.appendChild(script)
    }, {
        args: {
            component,
            props,
            slots,
        }
    })
}