import * as componentsLib from './public-api.ts';
import { UserInterfaceType, DropdownOptionItem,RangeSettings } from 'zero-annotation';
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

const createInputElement = (key: string, config: any, customElement: HTMLElement) => {
    const inputElement = document.createElement('div');
    
    const label = document.createElement('label');
    label.textContent = config.displayLabel || key;
    label.htmlFor = key;
    inputElement.appendChild(label);

    switch (config.uiComponentType) {
        case UserInterfaceType.TEXT_INPUT:
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.id = key;
            textInput.value = config.initialValue?.toString() || '';
            textInput.placeholder = config.placeholderText || '';
            textInput.addEventListener('input', (e) => {
                customElement[key] = (e.target as HTMLInputElement).value;
            });
            inputElement.appendChild(textInput);
            break;

        case UserInterfaceType.PASSWORD_INPUT:
            const passwordInput = document.createElement('input');
            passwordInput.type = 'password';
            passwordInput.id = key;
            passwordInput.value = config.initialValue?.toString() || '';
            passwordInput.placeholder = config.placeholderText || '';
            passwordInput.addEventListener('input', (e) => {
                customElement[key] = (e.target as HTMLInputElement).value;
            });
            inputElement.appendChild(passwordInput);
            break;
            
        case UserInterfaceType.TEXTAREA:
            const textarea = document.createElement('textarea');
            textarea.id = key;
            textarea.value = config.initialValue?.toString() || '';
            textarea.placeholder = config.placeholderText || '';
            textarea.addEventListener('input', (e) => {
                customElement[key] = (e.target as HTMLTextAreaElement).value;
            });
            inputElement.appendChild(textarea);
            break;

        case UserInterfaceType.CHECKBOX:
            const toggleSwitch = document.createElement('input');
            toggleSwitch.type = 'checkbox';
            toggleSwitch.id = key;
            toggleSwitch.checked = Boolean(config.initialValue);
            toggleSwitch.addEventListener('change', (e) => {
                customElement[key] = (e.target as HTMLInputElement).checked;
            });
            inputElement.appendChild(toggleSwitch);
            break;

        case UserInterfaceType.RADIO_BUTTON:
            const radioGroup = document.createElement('div');
            (config.optionItems as DropdownOptionItem[]).forEach(option => {
                const radioWrapper = document.createElement('div');
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = key;
                radioInput.id = `${key}_${option.value}`;
                radioInput.value = option.value.toString();
                radioInput.checked = option.value.toString() === config.initialValue?.toString();
                radioInput.addEventListener('change', (e) => {
                    customElement[key] = (e.target as HTMLInputElement).value;
                });

                const radioLabel = document.createElement('label');
                radioLabel.htmlFor = radioInput.id;
                radioLabel.textContent = option.label.toString();
                
                radioWrapper.appendChild(radioInput);
                radioWrapper.appendChild(radioLabel);
                radioGroup.appendChild(radioWrapper);
            });
            inputElement.appendChild(radioGroup);
            break;

        case UserInterfaceType.DROPDOWN:
            const dropdown = document.createElement('select');
            dropdown.id = key;
            (config.optionItems as DropdownOptionItem[])?.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value.toString();
                optionElement.textContent = option.label.toString();
                dropdown.appendChild(optionElement);
            });
            dropdown.addEventListener('change', (e) => {
                customElement[key] = (e.target as HTMLSelectElement).value;
            });
            inputElement.appendChild(dropdown);
            break;

        case UserInterfaceType.MULTI_SELECT:
            const multiSelect = document.createElement('select');
            multiSelect.id = key;
            multiSelect.multiple = true;
            (config.optionItems as DropdownOptionItem[])?.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value.toString();
                optionElement.textContent = option.label.toString();
                multiSelect.appendChild(optionElement);
            });
            multiSelect.addEventListener('change', (e) => {
                customElement[key] = Array.from((e.target as HTMLSelectElement).selectedOptions).map(option => option.value);
            });
            inputElement.appendChild(multiSelect);
            break;
            
        case UserInterfaceType.RANGE_SLIDER:
            const rangeSlider = document.createElement('input');
            rangeSlider.type = 'range';
            rangeSlider.id = key;
            rangeSlider.min = (config.optionItems as RangeSettings).min?.toString() || '0';
            rangeSlider.max = (config.optionItems as RangeSettings).max?.toString() || '100';
            rangeSlider.value = config.initialValue?.toString() || '0';
            rangeSlider.addEventListener('input', (e) => {
                customElement[key] = (e.target as HTMLInputElement).value;
            });
            inputElement.appendChild(rangeSlider);
            break;
            
        case UserInterfaceType.COLOR_PICKER:
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.id = key;
            colorPicker.value = config.initialValue?.toString() || '#ffffff';
            colorPicker.addEventListener('input', (e) => {
                customElement[key] = (e.target as HTMLInputElement).value;
            });
            inputElement.appendChild(colorPicker);
            break;
        
        case UserInterfaceType.FILE_INPUT:
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = key;
            fileInput.addEventListener('change', (e) => {
                customElement[key] = (e.target as HTMLInputElement).files;
            });
            inputElement.appendChild(fileInput);
            break;

        case UserInterfaceType.DATE_PICKER:
            const datePicker = document.createElement('input');
            datePicker.type = 'date';
            datePicker.id = key;
            datePicker.value = config.initialValue?.toString() || '';
            datePicker.addEventListener('input', (e) => {
                customElement[key] = (e.target as HTMLInputElement).value;
            });
            inputElement.appendChild(datePicker);
            break;

        // Add cases for other UserInterfaceTypes as needed

        default:
            const defaultInput = document.createElement('input');
            defaultInput.type = 'text';
            defaultInput.id = key;
            defaultInput.value = config.initialValue?.toString() || '';
            defaultInput.placeholder = config.placeholderText || '';
            defaultInput.addEventListener('input', (e) => {
                customElement[key] = (e.target as HTMLInputElement).value;
            });
            inputElement.appendChild(defaultInput);
            break;
    }

    return inputElement;
};


const registerComponent = (name: string, config: { inputs?: any; outputs?: any }) => {
    const { inputs = {}, outputs = { events: [] } } = config;

    const customElement = document.createElement(name) as any;

    if (!globalThis.zeroComponents[name]) {
        globalThis.zeroComponents[name] = [];
    }
    globalThis.zeroComponents[name].push(customElement);

    // Update the UI to show the component in the list
    updateComponentList();

    (outputs.events || []).forEach(event => {
        customElement.addEventListener(event, (e: Event) => {
            console.log(`[${name}][event:${event}]`, e);
        });
    });
};

const loadComponents = (): Promise<void> => {
    return new Promise((resolve) => {
        const componentsConfig = extractComponentsConfig();
        Object.entries(componentsConfig).forEach(([name, config]) => {
            registerComponent(name, config);
        });
        resolve(); // Notify that components have been loaded
    });
};

const extractComponentsConfig = (): Record<string, any> => {
    const components = {} as Record<string, any>;

    for (const _class of Object.values(componentsLib)) {
        const inputsMetadata = Reflect.getMetadata('ZeroAttribute', _class.prototype) || [];
        const componentMetadata = Reflect.getMetadata('ZeroComponent', _class.prototype);
        const selector = `${componentMetadata.selector}-${componentMetadata.version}`;

        components[selector] = {
            inputs: inputsMetadata.filter(input => !input.eventTrigger).reduce((acc: Record<string, any>, { fieldMappings, ...rest }) => {
                acc[fieldMappings] = { ...rest };
                return acc;
            }, {}),
            outputs: { events: inputsMetadata.filter(input => input.eventTrigger).map(input => input.eventTrigger) },
        };
    }

    return components;
};

// Function to update the component list in the UI
const updateComponentList = () => {
    const componentList = document.getElementById('componentList');
    if (componentList) {
        componentList.innerHTML = ''; // Clear existing list
        Object.keys(globalThis.zeroComponents).forEach(key => {
            const listItem = document.createElement('li');
            listItem.textContent = key;
            listItem.addEventListener('click', () => {
                const component = globalThis.zeroComponents[key][0]; // Assuming single instance for simplicity
                displayComponent(component);
                updateUrlWithComponent(key);
                updateNavForComponent(key); // Open sidenav
            });
            componentList.appendChild(listItem);
        });
    } else {
        console.error('componentList element not found');
    }
};

const displayComponent = (component: HTMLElement) => {
    const main = document.getElementById('main');
    if (main) {
        main.innerHTML = ''; // Clear existing content
        main.appendChild(component);
    } else {
        console.error('main element not found');
    }
};

const updateUrlWithComponent = (componentName: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('component', componentName);
    history.pushState({}, '', url.toString());
};

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    initializeStyles();
    await loadComponents(); // Ensure components are loaded before updating the UI
    updateComponentList(); // Update the UI with the list of component keys

    // Handle URL changes
    const urlParams = new URLSearchParams(window.location.search);
    const componentName = urlParams.get('component');
    if (componentName) {
        const component = globalThis.zeroComponents[componentName]?.[0];
        if (component) {
            displayComponent(component);
            updateNavForComponent(componentName);
        }
    } else {
        hideNav(); // Hide sidenav if no component is selected
    }
});

// Update sidenav based on selected component
const updateNavForComponent = (componentName: string) => {
    const sidenavelist = document.getElementById('sidenav-list');
    const componentConfig = extractComponentsConfig()[componentName];
    if (sidenavelist && componentConfig) {
        sidenavelist.innerHTML = ''; // Clear existing inputs
        Object.entries(componentConfig.inputs).forEach(([key, config]) => {
            const inputElement = createInputElement(key, config, globalThis.zeroComponents[componentName][0]);
            sidenavelist.appendChild(inputElement);
        });
        showNav(); // Show sidenav when a component is selected
    } else {
        console.error('sidenav-list element not found or componentConfig not found');
    }
};

const showNav = () => {
    const sidenav = document.getElementById('sidenav');
    if (sidenav) {
        sidenav.style.display = 'block';
    } else {
        console.error('sidenav element not found');
    }
};

const hideNav = () => {
    const sidenav = document.getElementById('sidenav');
    if (sidenav) {
        sidenav.style.display = 'none';
    } else {
        console.error('sidenav element not found');
    }
};
