export function mdFileExport(mdText : string) {
    const mdContents = mdText
    const blob= new Blob([mdContents], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    return url
}