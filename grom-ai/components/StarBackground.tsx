import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  delay: number;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.5 + 0.5,
    opacity: new Animated.Value(Math.random() * 0.6 + 0.1),
    delay: Math.random() * 3000,
  }));
}

const STARS = generateStars(80);

function StarDot({ star }: { star: Star }) {
  useEffect(() => {
    const twinkle = () => {
      Animated.sequence([
        Animated.timing(star.opacity, {
          toValue: Math.random() * 0.8 + 0.1,
          duration: 1500 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(star.opacity, {
          toValue: Math.random() * 0.3 + 0.05,
          duration: 1500 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ]).start(twinkle);
    };

    const timer = setTimeout(twinkle, star.delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          opacity: star.opacity,
        },
      ]}
    />
  );
}

export function StarBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, styles.bg]} />
      <View style={[StyleSheet.absoluteFill, styles.nebula1]} />
      <View style={[StyleSheet.absoluteFill, styles.nebula2]} />
      {STARS.map((star, i) => (
        <StarDot key={i} star={star} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: "#05090F",
  },
  star: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },
  nebula1: {
    position: "absolute",
    top: -height * 0.3,
    left: -width * 0.3,
    width: width * 1.2,
    height: height * 0.8,
    borderRadius: width,
    backgroundColor: "rgba(60,40,120,0.15)",
  },
  nebula2: {
    position: "absolute",
    bottom: -height * 0.2,
    right: -width * 0.3,
    width: width * 1.1,
    height: height * 0.6,
    borderRadius: width,
    backgroundColor: "rgba(20,50,100,0.12)",
  },
});
