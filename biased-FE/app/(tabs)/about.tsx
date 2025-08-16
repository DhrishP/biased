import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="brain" size={50} color={colors.primary} />
          <Text style={styles.title}>Cognitive Bias Detector</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What are Cognitive Biases?</Text>
          <Text style={styles.text}>
            Cognitive biases are systematic patterns of deviation from norm or
            rationality in judgment. They are mental shortcuts that can lead to
            perceptual distortion, inaccurate judgment, illogical
            interpretation, or irrationality.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How This App Works</Text>
          <Text style={styles.text}>
            This app analyzes your text input to identify potential cognitive
            biases in your thinking. It uses advanced language processing to
            detect patterns associated with common biases.
          </Text>
          <Text style={styles.text}>
            The analysis provides a percentage breakdown of detected biases and
            offers suggestions on how to counteract them for more balanced
            thinking.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Detect Biases?</Text>
          <Text style={styles.text}>• Improve decision-making quality</Text>
          <Text style={styles.text}>• Develop more balanced perspectives</Text>
          <Text style={styles.text}>• Enhance critical thinking skills</Text>
          <Text style={styles.text}>• Reduce errors in reasoning</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Learn More About Cognitive Biases
          </Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() =>
              openLink("https://en.wikipedia.org/wiki/List_of_cognitive_biases")
            }
          >
            <Text style={styles.linkText}>
              Wikipedia: List of Cognitive Biases
            </Text>
            <Ionicons name="open-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => openLink("https://yourlogicalfallacyis.com/")}
          >
            <Text style={styles.linkText}>Your Logical Fallacy Is</Text>
            <Ionicons name="open-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => openLink("https://yourbias.is/")}
          >
            <Text style={styles.linkText}>Your Bias Is</Text>
            <Ionicons name="open-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This app is for educational purposes only. It does not provide
            psychological advice or diagnosis.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: colors.textLight,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    flex: 1,
  },
  footer: {
    marginTop: 12,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    fontStyle: "italic",
  },
});
