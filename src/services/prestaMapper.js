export function xmlToEmployees(xmlString){
    const xml = new DOMParser().parseFromString(xmlString, "text/xml");

    return [
        ...xml.getElementsByTagName("employee")
    ].map((e) => {
        return {
            id: e.querySelector("id")?.textContent?.trim(),
            email: e.querySelector("email")?.textContent?.trim()
        };
    });
}