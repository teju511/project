// Food recommendations based on emotion
export function getFoodRecommendations(emotion, foodPreference) {
  const foodOptions = {
    veg: {
      happy: ['Veggie Pizza', 'Fruit Smoothie', 'Salad with Nuts', 'Vegetable Stir Fry'],
      sad: ['Comfort Veggie Pasta', 'Warm Vegetable Soup', 'Sweet Dessert', 'Herbal Tea'],
      anxious: ['Calming Chamomile Tea', 'Light Salad', 'Yogurt Parfait', 'Green Smoothie'],
      angry: ['Spicy Vegetable Curry', 'Grilled Vegetables', 'Lentil Soup', 'Whole Grain Bread'],
      calm: ['Fresh Fruit', 'Nuts & Seeds', 'Herbal Tea', 'Meditation Snack Mix'],
      confused: ['Brain Boosting Berries', 'Dark Chocolate', 'Almonds', 'Green Tea'],
      neutral: ['Mixed Vegetables', 'Grain Bowl', 'Light Snack', 'Water & Fruits']
    },
    nonveg: {
      happy: ['Grilled Chicken', 'Fish & Chips', 'BBQ Meat', 'Seafood Pasta'],
      sad: ['Warm Meat Soup', 'Comfort Meat Stew', 'Roasted Chicken', 'Meat Curry'],
      anxious: ['Grilled Fish', 'Light Meat Salad', 'Boiled Chicken', 'Seafood Broth'],
      angry: ['Spicy Meat Curry', 'Grilled Steak', 'Barbecue', 'Meat Skewers'],
      calm: ['Poached Fish', 'Tender Chicken', 'Light Meat Dish', 'Seafood Risotto'],
      confused: ['Protein-rich Steak', 'Salmon with Brain Nutrients', 'Egg Curry', 'Chicken Brain Boost'],
      neutral: ['Grilled Meat', 'Simple Fish', 'Meat & Veggie', 'Balanced Plate']
    },
    chat: {
      happy: ['Chai with Friends', 'Coffee Date', 'Tea & Snacks', 'Chat Over Drinks'],
      sad: ['Comfort Tea', 'Soothing Chat', 'Warm Beverage', 'Listening Session'],
      anxious: ['Calming Tea Ritual', 'Peaceful Chat', 'Meditation Tea', 'Quiet Coffee'],
      angry: ['Strong Coffee', 'Energizing Chat', 'Discussion Break', 'Tension Release Talk'],
      calm: ['Relaxing Tea', 'Peaceful Chat', 'Herbal Ritual', 'Mindful Beverage'],
      confused: ['Clarity Chat', 'Thoughtful Tea', 'Discussion & Ideas', 'Brainstorm Session'],
      neutral: ['Regular Chat', 'Coffee Break', 'Tea Time', 'Casual Conversation']
    }
  };

  const recommendations = foodOptions[foodPreference] || foodOptions.veg;
  return recommendations[emotion] || ['Try something new based on your mood!'];
}

// Social media suggestions based on emotion
export function getSocialMediaSuggestions(emotion, platforms) {
  const platformContent = {
    instagram: {
      happy: ['Follow inspiring accounts', 'Share your happy moments', 'Explore travel stories', 'Follow art & design pages'],
      sad: ['Join supportive communities', 'Follow motivational accounts', 'Watch uplifting reels', 'Join wellness groups'],
      anxious: ['Follow meditation accounts', 'Join wellness communities', 'Watch calming content', 'Follow mental health advocates'],
      angry: ['Follow funny content', 'Join hobby communities', 'Watch comedy reels', 'Follow positive creators'],
      calm: ['Follow minimalist accounts', 'Join zen communities', 'Watch peaceful content', 'Follow nature photographers'],
      confused: ['Follow educational accounts', 'Join learning communities', 'Watch how-to content', 'Follow experts in your field'],
      neutral: ['Explore discover page', 'Follow friends & family', 'Join interest groups', 'Watch trending content']
    },
    facebook: {
      happy: ['Join celebration groups', 'Share life updates', 'Join hobby groups', 'Connect with community'],
      sad: ['Join support groups', 'Connect with friends', 'Join interest communities', 'Watch uplifting stories'],
      anxious: ['Join wellness groups', 'Follow mental health pages', 'Join calming communities', 'Connect with support networks'],
      angry: ['Join hobby groups', 'Share achievements', 'Join positive communities', 'Connect with like-minded people'],
      calm: ['Join meditation groups', 'Follow wellness pages', 'Join peaceful communities', 'Connect authentically'],
      confused: ['Join discussion groups', 'Follow educational pages', 'Join learning communities', 'Ask questions'],
      neutral: ['Browse news feed', 'Connect with friends', 'Join groups', 'Explore events']
    },
    youtube: {
      happy: ['Watch music videos', 'Comedy channels', 'Celebration compilations', 'Feel-good documentaries'],
      sad: ['Motivational speeches', 'Inspiring stories', 'Uplifting music', 'Heartwarming content'],
      anxious: ['Meditation sessions', 'Calming music', 'Yoga tutorials', 'Breathing exercises'],
      angry: ['Comedy specials', 'Workout videos', 'Creative tutorials', 'Positive content'],
      calm: ['Peaceful nature videos', 'Meditation guides', 'Lo-fi music', 'Relaxation content'],
      confused: ['Educational videos', 'How-to guides', 'Expert talks', 'Learning tutorials'],
      neutral: ['General entertainment', 'News channels', 'Hobby content', 'Mixed channels']
    }
  };

  let suggestions = [];
  for (const platform of platforms) {
    if (platformContent[platform.toLowerCase()]) {
      const content = platformContent[platform.toLowerCase()][emotion] || 
                     platformContent[platform.toLowerCase()].neutral;
      suggestions.push(`${platform}: ${content[0]}`);
    }
  }

  return suggestions;
}

// Travel recommendations based on location and emotion
export function getTravelRecommendations(emotion, travelType, userLocation = null) {
  const recommendations = {
    temple: {
      happy: {
        places: ['Golden Temple (spiritual)', 'Varanasi Temples (scenic)', 'Meenakshi Temple (grand)'],
        activities: ['Meditation', 'Spiritual exploration', 'Photography', 'Community gathering']
      },
      sad: {
        places: ['Peaceful Temple Gardens', 'Sacred Pilgrimage Sites', 'Spiritual Retreat Temples'],
        activities: ['Meditation', 'Prayer', 'Reflection', 'Spiritual healing']
      },
      anxious: {
        places: ['Quiet Temple Premises', 'Serene Ashrams', 'Meditation Centers'],
        activities: ['Meditation', 'Yoga', 'Chanting', 'Spiritual guidance']
      },
      angry: {
        places: ['Grand Temples', 'Pilgrimage Routes', 'Spiritual Retreat Centers'],
        activities: ['Pilgrimage', 'Volunteering', 'Community service', 'Spiritual journey']
      },
      calm: {
        places: ['Peaceful Temples', 'Meditation Centers', 'Sacred Gardens'],
        activities: ['Meditation', 'Spiritual study', 'Reflection', 'Peace']
      },
      confused: {
        places: ['Teaching Temples', 'Spiritual Centers', 'Wisdom Retreats'],
        activities: ['Learning', 'Spiritual guidance', 'Reflection', 'Wisdom seeking']
      },
      neutral: {
        places: ['Popular Temples', 'Religious Sites', 'Cultural Heritage'],
        activities: ['Sightseeing', 'Cultural experience', 'Photography', 'Learning']
      }
    },
    park: {
      happy: {
        places: ['Adventure Parks', 'Amusement Parks', 'Active Recreation Areas'],
        activities: ['Sports', 'Picnic', 'Games', 'Outdoor fun']
      },
      sad: {
        places: ['Nature Parks', 'Botanical Gardens', 'Lakeside Parks'],
        activities: ['Walking', 'Reflection', 'Nature time', 'Peaceful space']
      },
      anxious: {
        places: ['Quiet Nature Parks', 'Gardens', 'Peaceful Trails'],
        activities: ['Slow walk', 'Breathing exercises', 'Meditation', 'Nature therapy']
      },
      angry: {
        places: ['Adventure Parks', 'Sports Grounds', 'Active Recreation'],
        activities: ['Sports', 'Running', 'Hiking', 'Physical activity']
      },
      calm: {
        places: ['Botanical Gardens', 'Scenic Parks', 'Lakeside Areas'],
        activities: ['Walking', 'Meditation', 'Reading', 'Relaxation']
      },
      confused: {
        places: ['Open Parks', 'Nature Spaces', 'Scenic Routes'],
        activities: ['Walking', 'Thinking', 'Reflection', 'Clarity walking']
      },
      neutral: {
        places: ['Community Parks', 'Public Gardens', 'Recreation Areas'],
        activities: ['Walking', 'Relaxation', 'Social time', 'Leisure']
      }
    }
  };

  return recommendations[travelType]?.[emotion] || recommendations[travelType]?.neutral || 
         { places: ['Check local tourism sites'], activities: ['Explore nearby areas'] };
}
