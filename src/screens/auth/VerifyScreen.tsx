import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext";

type VerifyScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Verify">;
  route: RouteProp<RootStackParamList, "Verify">;
};

export const VerifyScreen: React.FC<VerifyScreenProps> = ({
  navigation,
  route,
}) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { userId } = route.params;
  const { verifyCode } = useAuth();

  const handleVerify = async () => {
    if (!code) {
      alert("Please enter the verification code");
      return;
    }

    try {
      setLoading(true);
      await verifyCode(parseInt(code));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Account</Text>
          <Text style={styles.subtitle}>
            Please enter the 4-digit code sent to your email
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.codeContainer}>
            <TextInput
              style={styles.codeInput}
              placeholder="0000"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={4}
              textAlign="center"
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Verify Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Didn't receive the code? </Text>
            <TouchableOpacity
              onPress={() => {
                /* Handle resend code */
              }}
            >
              <Text style={styles.link}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  form: {
    alignItems: "center",
  },
  codeContainer: {
    marginVertical: 30,
  },
  codeInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 20,
    fontSize: 24,
    fontWeight: "bold",
    width: 160,
    letterSpacing: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#99c9ff",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  link: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default VerifyScreen;
