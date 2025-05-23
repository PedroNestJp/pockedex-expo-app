import { View, Text } from "react-native";
import { globalStyles } from "../src/theme/styles";

export default function HomeScreen() {
  return (
    <View style={globalStyles.center}>
      <Text style={globalStyles.title}>Pokédex Home</Text>
    </View>
  );
}
