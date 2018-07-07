export default i => i.replace(/&emsp;/g, ' ').replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#92;/g, "\\").replace(/&#36;/g, "$").replace(/&amp;/g, "&").replace(/&#12539;/g, '・');