export const calculateReviewStats = (reviews) => {
  const totalReviews = reviews.length;
  const ratingCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  reviews.forEach((review) => {
    ratingCounts[review.rating]++;
  });

  const ratingStats = Object.keys(ratingCounts).map((rating) => ({
    rating: parseInt(rating),
    percentage:
      totalReviews > 0
        ? Math.round((ratingCounts[rating] / totalReviews) * 100)
        : 0,
  }));

  return ratingStats.sort((a, b) => b.rating - a.rating);
};
