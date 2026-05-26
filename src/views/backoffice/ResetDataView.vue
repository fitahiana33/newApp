<template>
    <h1>Reanitialiser les donnees</h1>
    <button type="button" @click="resetData" :disabled="loading">Reset</button>
    <TerminalLog
        class="mt-4"
        title="Console de réinitialisation"
        :lines="logs"
        empty-text="Aucun log pour le moment"
        height="360px"
    />

    <br>
    <pre v-if="result">{{ JSON.stringify(result, null, 2) }}</pre>
    <a href="/dashboard">Dashboard</a>
</template>

<script setup>
    import { ref } from "vue"; // Import ref pour la réactivité
    import { reset } from "../../services/resetService";
    import TerminalLog from "../../components/TerminalLogView.vue";
    const logs = ref([]);
    const result = ref(null);
    const loading = ref(false);
    async function resetData() {
        if (!confirm("Êtes-vous sûr de vouloir supprimer TOUTES les données importées ? Cette action est irréversible.")) {
        return; // Annule si non confirmé
        }

        loading.value = true;
        logs.value = [];
        try{
            result.value = await reset({
                log: (m) => logs.value.push(m)
            })
        }finally{
            loading.value = false;
        }
    }
</script>