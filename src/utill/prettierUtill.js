import { format as prettierFormat } from 'prettier';

// Define configuration for Prettier formatting
const prettierConfig = {
    printWidth: 80,
    singleQuote: true,
    quoteProps: 'as-needed',
    trailingComma: 'es5',
    tabWidth: 4,
    semi: true,
    bracketSpacing: true,
    arrowParens: 'avoid',
    // Option for markdown text wrapping
    // proseWrap: "never"
};

/**
 * Formats the given code using Prettier.
 * @param {string | Object} input - The code or object to be formatted.
 * @param {import('prettier').LiteralUnion<import('prettier').BuiltInParserName>} [parser] - The parser to use (optional).
 * @returns {Promise<string>} - A promise that resolves to the formatted code.
 */
export const formatCode = async (input, parser) => {
    const formatted = typeof input === 'string' 
        ? prettierFormat(input, { ...prettierConfig, parser: parser || 'typescript' })
        : prettierFormat(JSON.stringify(input, null, 2), { ...prettierConfig, parser: 'json' });
        
    return formatted;
};
