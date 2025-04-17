const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Add Node constant since it's not available in Node.js
const Node = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
};

function toCamelCase(str) {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
        .replace(/[^a-zA-Z0-9]/g, '');
}

function getUniqueName(tagName, index) {
    return `${tagName}_${index}`;
}

function extractIncludes() {
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    const $ = cheerio.load(htmlContent, { recognizeComment: true });

    const includesPath = path.join('src', '_includes');
    if (!fs.existsSync(includesPath)) {
        fs.mkdirSync(includesPath, { recursive: true });
    }

    const bodyChildren = $('body')[0].children;
    let tagCount = {};
    let lastComment = null;

    bodyChildren.forEach((node) => {
        if (node.type === 'comment') {
            // Save the last seen comment
            lastComment = node.data.trim();
        } else if (node.type === 'tag') {
            const $element = $(node);
            const tagName = node.name.toLowerCase();
            let filename;

            if (lastComment) {
                const cleanComment = lastComment.replace(/<!--|-->|\/\*|\*\//g, '').trim();
                filename = toCamelCase(cleanComment) + '.njk';
            } else {
                if (!tagCount[tagName]) {
                    tagCount[tagName] = 0;
                }
                filename = getUniqueName(tagName, tagCount[tagName]) + '.njk';
                tagCount[tagName]++;
            }

            const filePath = path.join(includesPath, filename);
            fs.writeFileSync(filePath, $.html($element)); // write full element, not just inner HTML
            console.log(`Created include file: ${filename}`);

            // Update base.njk if exists
            const layoutPath = path.join(includesPath, 'layouts', 'base.njk');
            if (fs.existsSync(layoutPath)) {
                const layoutContent = fs.readFileSync(layoutPath, 'utf8');
                const includeStatement = `{% include "${filename}" %}\n`;
                if (!layoutContent.includes(includeStatement)) {
                    fs.writeFileSync(layoutPath, layoutContent + includeStatement);
                }
            }

            lastComment = null; // Reset after using
        }
    });
}

// Run the extraction
extractIncludes();
