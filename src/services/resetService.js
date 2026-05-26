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
        return { ok: resp.status >= 200 && resp.status < 300, status: resp.status, data: resp.data};
    }catch(err){
        const status = err?.response?.status;
        const body = err?.response?.data; 
        console.error('Erreur de supression', ressource, id, status, body || err);
        return { ok: false, status, body: body || (err?.message || String(err)) };
    }
}

export async function reset({
        ressourceTrier = ['orders','carts','combinations','product_option_values','product_options','products','customers','categories','taxes'],
        log = (m) => console.log(m),
        perItemDelay = 150,
    } = {}){
        try{
            log(`La supression commence`);
            const summary = { deletedCounts: {}, errors: [] };
            for(const ressource of ressourceTrier){
                log(`Supression de : ${ressource}`);
                const ids = await getIds(ressource);
                let nbrLigne = 0;
                summary.deletedCounts[ressource] = 0
                for(const id of ids){
                    try{
                        const deleteOk = await deleteRessource(ressource, id);
                        if(deleteOk){
                            log(`suppression d'id : ${id} avec succes`);
                            summary.deletedCounts[ressource] ++;
                            nbrLigne ++;
                        }else{
                            summary.errors.push({ressource,id,reason: `erreur de la supression de ${ressource} , id = ${id}`});
                        }
                    }catch(err){
                        summary.errors.push({ressource, id, reason : err?.message || String(err) });
                        log(`Error deleting ${ressource}/${id}: ${err?.message || err}`);
                    }
                    await new Promise(r => setTimeout(r, perItemDelay));
                }
                log(`Supression de ${nbrLigne} de ${ressource}`);
            }
            log(`Suppression de reussi`);
            return summary;
        } catch(err){
            log(`Erreur de supression : ${err.message}`);
        }
}

export default { getIds, deleteRessource, reset };