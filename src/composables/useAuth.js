import { ref, computed } from "vue";
import { loginByEmail } from "../services/auth";

const storageKey = "currentUser";
const currentUser = ref(JSON.parse(localStorage.getItem(storageKey)) || null);

export function useAuth() {
    const isLogged = computed(() => !!currentUser.value);

    async function login(email) {
      const user = await loginByEmail(email);
      currentUser.value = user;
      localStorage.setItem(storageKey, JSON.stringify(user));
      return user;
    }

    function logout() {
      currentUser.value = null;
      localStorage.removeItem(storageKey);
    }

    return { currentUser, isLogged, login, logout };
}