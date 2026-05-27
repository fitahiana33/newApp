<script setup>
  import { useAuth } from '@/composables/useAuth';
  import { useRouter } from 'vue-router';
  const {logout} = useAuth();
  const router = useRouter();
  function deconnecter(){
    logout();
    router.push("/");
  }
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <p>Bienvenue sur le backoffice.</p>
    <a href="/resetData">Reset Data</a>
    <br>
    <a href="/importData">Importer donnees</a>
    <br>
    <button type="button" @click="deconnecter">Deconnexion</button>
  </div>
</template>