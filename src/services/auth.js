import api from "./prestashopAPI";
import { xmlToEmployees } from "./prestaMapper";

export async function fetchEmployees() {
    const res = await api.get("/employees?display=full");
    return xmlToEmployees(res.data);
}

export async function fetchEmployeeByEmail(email) {
    if(!email) return null;
    const list = await fetchEmployees();
    return list.find(e => e.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function loginByEmail(email) {
    const emp = await fetchEmployeeByEmail(email);
    if (emp) return emp;
    throw new Error("Email introuvable");
}