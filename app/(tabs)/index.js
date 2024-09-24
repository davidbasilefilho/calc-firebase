// App.js
import React, { useState, useEffect } from "react";
import { evaluate } from "mathjs";
import {
  TextInput,
  Button,
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { db, auth } from "../../src/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expressao, setExpressao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [cadastrado, setCadastrado] = useState(true);
  const [listaExpressoes, setListaExpressoes] = useState([]);

  const handleAuth = async () => {
    try {
      if (cadastrado) {
        await signInWithEmailAndPassword(auth, email, password);
        setMensagem("Login bem-sucedido!");
        fetchUserExpressions();
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMensagem("Registro bem-sucedido!");
      }
    } catch (error) {
      setMensagem(error.message);
    }
  };

  const logExpressao = async () => {
    if (expressao && auth.currentUser) {
      try {
        await addDoc(collection(db, "mathExpressions"), {
          expression: `${expressao} = ${evaluate(expressao)}`,
          userId: auth.currentUser.uid,
          timestamp: new Date(),
        });
        setMensagem("Expressão registrada!");
        setExpressao("");
        fetchUserExpressions();
      } catch (error) {
        console.error("Erro ao registrar expressão: ", error);
        setMensagem("Erro ao registrar expressão.");
      }
    } else {
      setMensagem("Por favor, insira uma expressão e faça login.");
    }
  };

  const fetchUserExpressions = async () => {
    if (auth.currentUser) {
      const q = query(
        collection(db, "mathExpressions"),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const expressoes = [];
      querySnapshot.forEach((doc) => {
        expressoes.push({ id: doc.id, ...doc.data() });
      });
      setListaExpressoes(expressoes);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserExpressions();
      } else {
        setListaExpressoes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={cadastrado ? "Login" : "Cadastrar"} onPress={handleAuth} />
      <Button
        title={cadastrado ? "Mudar para Cadastrar" : "Mudar para Login"}
        onPress={() => setCadastrado(!cadastrado)}
      />
      <TextInput
        style={styles.input}
        placeholder="Insira a expressão matemática"
        value={expressao}
        onChangeText={setExpressao}
      />
      <Button title="Registrar Expressão" onPress={logExpressao} />
      {mensagem ? <Text>{mensagem}</Text> : null}
      <FlatList
        data={listaExpressoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expressionItem}>
            <Text>{item.expression}</Text>
          </View>
        )}
        ListHeaderComponent={
          <Text style={styles.header}>Suas Expressões Registradas:</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
  },
  expressionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
