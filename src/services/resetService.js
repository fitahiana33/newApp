import prestashopApi from './prestashopAPI';
import { xmlToList } from './prestaMapper';

function remetEnSingulier(ressource){
    if(!ressource) return 'item';
    return ressource.endsWith('s') ? ressource.slice(0, -1) : ressource;
}

export async function getIds(ressource){
    try{
        const nomSingulier = remetEnSingulier(ressource);
        const res = await prestashopApi.get(ressource, {params: {display: '[id]'}, responseType: 'text'});
        const list = xmlToList(res.data, nomSingulier, ['id']);
        return list.map(item => (item.id != null ? String(item.id) : null)).filter(Boolean);
    } catch(err){
        console.error("Erreur lors de la recuperation de l ID", ressource, err);
        return [];
    }
}

export async function deleteRessource(ressource, id) {
    try{
        const resp = await prestashopApi.delete(`${ressource}/${id}`);
        return resp.status >= 200 && resp.status < 300;
    }catch(err){
        console.error('Erreur de supression', ressource, id, err)
        return false;
    }
}

export default { getIds, deleteRessource };