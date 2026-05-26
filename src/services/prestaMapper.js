function text(node, selector){
    return node.querySelector(selector)?.textContent?.trim() ?? null;
}

export function xmlToList(xmlString, itemTag, fields){
    const xml = new DOMParser().parseFromString(xmlString, "text/xml");
    const nodes = [...xml.getElementsByTagName(itemTag)];

    return nodes.map((node) => {
        const obj = {};
        for(const field of fields){
            obj[field] = text(node, field);
        }
        return obj;
    });
}