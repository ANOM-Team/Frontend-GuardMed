import React from "react";
import { View, Text } from "react-native";
import { Star } from "lucide-react-native";

const AverageRatingDisplay = ({ reviews }) => {
  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  // Round to one decimal place for display
  const displayRating = Math.round(averageRating * 10) / 10;

  // Create array of 5 stars
  const stars = Array(5).fill(0);

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>{displayRating}</Text>
      <View style={{ flexDirection: "row", marginVertical: 8 }}>
        {stars.map((_, index) => (
          <Star
            key={index}
            size={20}
            fill={index < averageRating ? "#22C55E" : "#D1D5DB"}
            color={index < averageRating ? "#22C55E" : "#D1D5DB"}
          />
        ))}
      </View>
      <Text style={{ fontSize: 14, color: "#6B7280" }}>
        {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
      </Text>
    </View>
  );
};

export default AverageRatingDisplay;
