import { View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

export default function Page() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator
        animating={true}
        size="large"
        color={MD2Colors.red800}
      />
    </View>
  );
}
