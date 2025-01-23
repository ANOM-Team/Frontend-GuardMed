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
  const [codeErr, setCodeErr] = useState("");

  const validateForm = () => {
    if (code == '') {
      setCodeErr("Verification code is required");
      return false;
    } else {
      setCodeErr("");
    }

    if (code.length < 4) {
      setCodeErr("Verification code must be 4 digits long");
      return false;
    } else {
      setCodeErr("");
    }

    return true;
  }

  const handleVerify = async () => {

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await verifyCode(parseInt(code));
      console.log("Verify response:", response);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Verification failed");
      console.log(error);
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
              placeholder="----"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={4}
              textAlign="center"
              autoFocus
            />
            <Text className="code-error" style={styles.inputError}>{codeErr ?? ''}</Text>
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
    backgroundColor: "#027E6A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#007AFF",
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#2B4F49",
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
    color: "#027E6A",
    fontSize: 14,
    fontWeight: "600",
  },
  inputError: {
    color: "#ff0000",
    fontSize: 12,
    paddingLeft: 10,
  }
});

export default VerifyScreen;
