import * as componentsLib from './public-api.ts';

declare global {
    interface Window {
        zero: any;
    }
}

// Initialize global components object
globalThis.zeroComponents = {} as Record<string, any>;

const initializeStyles = () => {
    const styleElement = document.createElement('style');
    document.head?.appendChild(styleElement);
};

const createInputElement = (key: string, value: string, customElement: HTMLElement) => {
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = value;
    inputElement.placeholder = key;
    inputElement.addEventListener('change', (e) => {
        customElement[key] = (e.target as HTMLInputElement).value;
    });
    return inputElement;
};

const registerComponent = (name: string, config: { inputs?: any; outputs?: any }) => {
    const { inputs = {}, outputs = { events: ['change'] } } = config;
    const fieldSet = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = name;

    const customElement = document.createElement(name) as any;
    const componentKey = name.substr(5);

    if (!globalThis.zeroComponents[componentKey]) {
        globalThis.zeroComponents[componentKey] = [];
    }
    globalThis.zeroComponents[componentKey].push(customElement);

    Object.entries(inputs).forEach(([key, value]) => {
        fieldSet.appendChild(createInputElement(key, value, customElement));
    });

    fieldSet.appendChild(legend);
    fieldSet.appendChild(customElement);

    (outputs.events || []).forEach(event => {
        customElement.addEventListener(event, (e: Event) => {
            console.log(`[${name}][event:${event}]`, e);
        });
    });

    document.body.appendChild(fieldSet);
};

const loadComponents = () => {
    const componentsConfig = extractComponentsConfig();
    Object.entries(componentsConfig).forEach(([name, config]) => {
        registerComponent(name, config);
    });
};

const extractComponentsConfig = (): Record<string, any> => {
    const components = {} as Record<string, any>;

    for (const _class of Object.values(componentsLib)) {
        const inputsMetadata = Reflect.getMetadata('ZeroAttribute', _class.prototype) || [];
        const componentMetadata = Reflect.getMetadata('ZeroComponent', _class.prototype);
        const selector = `${componentMetadata.selector}-${componentMetadata.version}`;

        components[selector] = {
            inputs: inputsMetadata.reduce((acc: Record<string, string>, { fieldMappings, defaultValue }) => {
                acc[fieldMappings] = defaultValue ?? '';
                return acc;
            }, {}),
            outputs: { events: ['change'] },
        };
    }

    return components;
};

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initializeStyles();
    loadComponents();
});
