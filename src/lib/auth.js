import { useMutation, useQuery } from "@tanstack/react-query";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const useSignUp = useMutation({
  mutationKey: ["signUp"],
  mutationFn: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

const useSignIn = useMutation({
  mutationKey: ["signIn"],
  mutationFn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

const useSignOut = useMutation({
  mutationKey: ["signOut"],
  mutationFn: async (email, password) => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

const fetchCurrentUser = async () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      resolve(user);
      unsubscribe(); // Clean up the listener
    });
  });
};

export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  return useQuery("currentUser", fetchCurrentUser, {
    staleTime: 60000, // Adjust as needed
    onSuccess: (data) => {
      // You can also store the user in query cache if needed
      queryClient.setQueryData("currentUser", data);
    },
  });
};
