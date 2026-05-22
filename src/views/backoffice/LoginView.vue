<script setup>
    import {ref, onMounted} from 'vue';
    import { useAuth } from '@/composables/useAuth';
    import router from '@/router';

    const {login, isLogged, currentUser} = useAuth();
    const email = ref('test@gmail.com');
    const loading = ref(false);
    const error = ref("");

    async function submit(){
        error.value = "";
        if(!email.value){
            error.value = "Email is required";
            return;
        }
        loading.value = true;
        try{
            await login(email.value);
            router.push("/dashboard");
        }catch(e){
            error.value = e.message || "Erreur de login";
        }finally{
            loading.value = false;
        }
    }

</script>

<template>
    <div>
        <h1>Login Backoffice</h1>
    </div>
    <form @submit.prevent="submit">
        <input v-model="email" type="email" placeholder="test@gmail.com" :class="{ invalid: error }"/>
        <button :disabled="loading">{{ loading ? "..." : "Se connecter"}}</button>
    </form>
</template>

<style scoped>
.invalid { border-color: tomato; }
.error { color: tomato; }
</style>