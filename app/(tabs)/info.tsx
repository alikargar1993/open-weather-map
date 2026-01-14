import { StyleSheet } from "react-native";

import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="info.circle"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          About
        </ThemedText>
      </ThemedView>

      <Collapsible title="Weather API">
        <ThemedText>
          This app uses the{" "}
          <ThemedText type="defaultSemiBold">OpenWeatherMap API</ThemedText> to
          fetch weather data.
        </ThemedText>
        <ThemedText style={styles.spacing}>
          <ThemedText type="defaultSemiBold">API Base URL:</ThemedText>{" "}
          https://api.openweathermap.org/data/2.5
        </ThemedText>
        <ThemedText style={styles.spacing}>
          <ThemedText type="defaultSemiBold">Free Tier Limits:</ThemedText>
        </ThemedText>
        <ThemedText>• 60 calls per minute</ThemedText>
        <ThemedText>• 1,000,000 calls per month</ThemedText>
        <ExternalLink href="https://openweathermap.org/api">
          <ThemedText type="link" style={styles.link}>
            Visit OpenWeatherMap API
          </ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Developer Information">
        <ThemedText>
          <ThemedText type="defaultSemiBold">Developer:</ThemedText> Ali Kargar
        </ThemedText>
        <ThemedText style={styles.spacing}>
          <ThemedText type="defaultSemiBold">Email:</ThemedText>{" "}
          <ExternalLink href="mailto:kargar.ali.1993@gmail.com">
            <ThemedText type="link">kargar.ali.1993@gmail.com</ThemedText>
          </ExternalLink>
        </ThemedText>
        <ThemedText style={styles.spacing}>
          <ThemedText type="defaultSemiBold">GitHub Repository:</ThemedText>
        </ThemedText>
        <ExternalLink href="https://github.com/alikargar1993/open-weather-map">
          <ThemedText type="link" style={styles.link}>
            https://github.com/alikargar1993/open-weather-map
          </ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  spacing: {
    marginTop: 8,
  },
  link: {
    marginTop: 8,
  },
});
