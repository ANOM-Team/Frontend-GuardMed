import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { MapPin, Clock, Phone, Star, Heart } from "lucide-react-native";
import splashImg from "../../assets/splash.jpg";
import PharmacyService from "../services/PharmacyService";
import ReviewService from "../services/ReviewService";
import { calculateReviewStats } from "../helpers";
import AverageRatingDisplay from "../components/AverageRatingDisplay";
import FavoriteService from "../services/FavoriteService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type DetailsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Details">;
};

export const DetailsScreen: React.FC<DetailsScreenProps> = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [pharmacy, setPharmacy] = useState({});
  const [reviews, setReviews] = useState([]);

  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      const favorite = {
        pharmacyId: "ZBvbRTZYu2Yoq7fatXkK",
        userId: "F4KoWNX1nOdcM5VNyiKe",
      };
      await FavoriteService.add(favorite);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const pharmacy = await PharmacyService.get("ZBvbRTZYu2Yoq7fatXkK");
      setPharmacy(pharmacy);
      const reviews = await ReviewService.get("ZBvbRTZYu2Yoq7fatXkK");
      setReviews(reviews);
    };

    fetchData();
  }, []);

  const ratingStats = calculateReviewStats(reviews);

  return (
    <ScrollView className="flex-1 bg-white pt-4">
      {/* Map Image with Favorite Button */}
      <View className="relative p-4">
        <Image source={splashImg} className="w-full h-60" resizeMode="cover" />
        <TouchableOpacity
          onPress={toggleFavorite}
          className="absolute top-6 right-6 bg-white p-2 rounded-full"
        >
          <Heart
            size={24}
            color={isFavorite ? "#EF4444" : "#666"}
            fill={isFavorite ? "#EF4444" : "none"}
          />
        </TouchableOpacity>
      </View>

      {/* Business Details */}
      <View className="p-4 space-y-4">
        {/* Address */}
        <View className="flex-row items-start gap-3 mb-4">
          <View className="bg-gray-100 p-4 rounded-lg">
            <MapPin size={20} color="#666" />
          </View>
          <View>
            <Text className="text-base font-medium">location</Text>
            <Text className="text-green-600">{pharmacy?.address}</Text>
          </View>
        </View>

        {/* Hours */}
        <View className="flex-row items-center gap-3 mb-4">
          <View className="bg-gray-100 p-4 rounded-lg">
            <Clock size={20} color="#666" />
          </View>
          <View>
            <Text className="text-base">Open</Text>
            <Text className="text-green-600">
              From {pharmacy?.openingHours?.open_at} AM -{" "}
              {pharmacy?.openingHours?.close_at} PM
            </Text>
          </View>
        </View>

        {/* Phone */}
        <View className="flex-row items-center gap-3">
          <View className="bg-gray-100 p-4 rounded-lg">
            <Phone size={20} color="#666" />
          </View>
          <View>
            <Text className="text-base">Phone number</Text>
            <Text className="text-green-600">{pharmacy?.phone}</Text>
          </View>
        </View>

        {/* Reviews Section */}
        <View className="mt-6">
          <Text className="text-lg font-semibold mb-2">
            Reviews and ratings
          </Text>
          <View className="flex-row justify-between items-center gap-8">
            {/* Left side - Rating summary */}
            <AverageRatingDisplay reviews={reviews} />

            {/* Right side - Rating bars */}
            <View className="flex-1">
              {ratingStats.map((item) => (
                <View
                  key={item.rating}
                  className="flex-row items-center space-x-2 mb-1"
                >
                  <Text className="w-4 text-sm text-gray-600">
                    {item.rating}
                  </Text>
                  <View className="flex-1 h-2 bg-gray-200 rounded-full">
                    <View
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </View>
                  <Text className="w-10 text-sm text-gray-600 ml-2">
                    {item.percentage}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Get Directions Button */}
        <TouchableOpacity className="mt-6 bg-gray-100 p-4 rounded-lg">
          <View className="flex-row items-center justify-center space-x-2">
            <MapPin size={20} color="#000" />
            <Text className="text-base font-medium">Get directions</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;
