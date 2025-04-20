import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

interface BlobBackgroundProps {
  colors: string[];
}

export default function BlobBackground({ colors }: BlobBackgroundProps) {
  return (
    <View style={styles.container}>
      {colors.map((color, index) => (
        <Svg
          key={index}
          style={[styles.blob, { top: index * 60, left: index * 40 }]}
          viewBox="0 0 200 200"
        >
          <Path
            fill={color}
            d="M40.5,-68.3C53.1,-59.7,64.5,-53.6,70.2,-43.4C75.9,-33.1,75.9,-18.7,76.6,-4.3C77.3,10.2,78.6,24.4,73.7,37.6C68.8,50.8,57.7,63.1,44.2,69.2C30.6,75.2,15.3,74.9,1.5,72.1C-12.3,69.2,-24.7,63.8,-36.7,56.1C-48.7,48.3,-60.2,38.1,-67.4,24.9C-74.6,11.6,-77.6,-4.6,-72.5,-18.3C-67.4,-32,-54.2,-43.2,-40.8,-50.7C-27.3,-58.2,-13.6,-62,0.9,-63.3C15.3,-64.5,30.6,-63,40.5,-68.3Z"
            transform="translate(100 100)"
          />
        </Svg>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  blob: {
    position: "absolute",
    width: 300,
    height: 300,
    opacity: 0.3,
  },
});
