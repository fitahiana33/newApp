<template>
    <h1>Reanitialiser les donnees</h1>
    <button type="button" @click="resetData">Reset</button>
    <br>
    <a href="/dashboard">Dashboard</a>
</template>

<script>
    import { ref } from "vue"; // Import ref pour la réactivité
    async function resetData() {
        if (!confirm("Êtes-vous sûr de vouloir supprimer TOUTES les données importées ? Cette action est irréversible.")) {
        return; // Annule si non confirmé
        }
    }
</script>