import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef, useEffect } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  Animated,
} from 'react-native';

const width = Dimensions.get('window').width;

// Enhanced quiz sections with attractive gradients and icons
const quizSections = [
  { 
    title: '🏛️ Bihar Political Quiz', 
    subtitle: 'Test Your Knowledge',
    gradient: ['#667eea', '#764ba2'],
    icon: 'school-outline',
    type: 'quiz'
  },
  { 
    title: '⚡ CM Prediction Game', 
    subtitle: 'Pick the Winner',
    gradient: ['#f093fb', '#f5576c'],
    icon: 'trophy-outline',
    type: 'cm_prediction'
  },
  { 
    title: '🗳️ Party Battle Arena', 
    subtitle: 'Alliance Wars',
    gradient: ['#4facfe', '#00f2fe'],
    icon: 'flash-outline',
    type: 'party_battle'
  },
  { 
    title: '🏢 Government Hub', 
    subtitle: 'Current Leaders',
    gradient: ['#43e97b', '#38f9d7'],
    icon: 'business-outline',
    type: 'govt_info'
  },
  { 
    title: '📊 Election Pulse', 
    subtitle: 'Live Analytics',
    gradient: ['#fa709a', '#fee140'],
    icon: 'analytics-outline',
    type: 'analysis'
  },
  { 
    title: '🎯 Political Arena', 
    subtitle: 'Master Quiz',
    gradient: ['#a8edea', '#fed6e3'],
    icon: 'rocket-outline',
    type: 'trivia'
  },
];

const heroCarousel = [
  { 
    uri: 'https://via.placeholder.com/350x180/667eea/FFFFFF?text=🏛️+Bihar+Elections+2024',
    title: 'Bihar Assembly Elections',
    subtitle: 'Democracy in Action'
  },
  { 
    uri: 'https://via.placeholder.com/350x180/f093fb/FFFFFF?text=🎯+Political+Predictions',
    title: 'Live Predictions',
    subtitle: 'Who Will Win?'
  },
  { 
    uri: 'https://via.placeholder.com/350x180/4facfe/FFFFFF?text=🗳️+Vote+Bihar',
    title: 'Your Vote Matters',
    subtitle: 'Shape the Future'
  },
];

// Enhanced quiz questions
const quizQuestions = [
  {
    question: "Who is the current Chief Minister of Bihar? 🏛️",
    options: ["Nitish Kumar", "Tejashwi Yadav", "Sushil Kumar Modi", "Chirag Paswan"],
    correct: 0,
    explanation: "Nitish Kumar has been serving as CM since 2017!"
  },
  {
    question: "Which party leads the ruling alliance in Bihar? 🤝",
    options: ["BJP", "JD(U)", "RJD", "Congress"],
    correct: 2,
    explanation: "RJD leads the Mahagathbandhan government!"
  },
  {
    question: "Bihar Legislative Assembly has how many seats? 🪑",
    options: ["243", "294", "403", "200"],
    correct: 0,
    explanation: "Bihar Assembly has 243 constituencies!"
  },
  {
    question: "Who is known as the 'Crown Prince' of Bihar politics? 👑",
    options: ["Chirag Paswan", "Tejashwi Yadav", "Tej Pratap Yadav", "Pushpam Priya"],
    correct: 1,
    explanation: "Tejashwi Yadav is often called the Crown Prince!"
  }
];

// Enhanced CM candidates with photos and stats
const cmCandidates = [
  { 
    name: "Nitish Kumar", 
    party: "JD(U)", 
    odds: "2:1",
    experience: "7-time CM",
    age: "73",
    color: "#10B981"
  },
  { 
    name: "Tejashwi Yadav", 
    party: "RJD", 
    odds: "3:1",
    experience: "Deputy CM",
    age: "34",
    color: "#F59E0B"
  },
  { 
    name: "Chirag Paswan", 
    party: "LJP", 
    odds: "8:1",
    experience: "Union Minister",
    age: "41",
    color: "#8B5CF6"
  },
  { 
    name: "Sushil Modi", 
    party: "BJP", 
    odds: "12:1",
    experience: "Ex-Deputy CM",
    age: "72",
    color: "#EF4444"
  }
];

const BiharPoliticalApp = () => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [walletVisible, setWalletVisible] = useState(false);
  
  // Wallet system
  const [totalCoins, setTotalCoins] = useState(0); // Starting coins
  const [recentEarnings, setRecentEarnings] = useState([]);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  
  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const coinAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateCoinEarning = (coins) => {
    setEarnedCoins(coins);
    setShowCoinAnimation(true);
    
    // Sparkle animation
    Animated.sequence([
      Animated.timing(sparkleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(sparkleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Coin animation
    Animated.sequence([
      Animated.timing(coinAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(coinAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCoinAnimation(false);
      setTotalCoins(prev => prev + coins);
    });
  };

  const handleSectionPress = (section) => {
    animatePress();
    setCurrentSection(section);
    setModalVisible(true);
    if (section.type === 'quiz') {
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setRecentEarnings([]);
  };

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    let coinsEarned = 0;
    
    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setQuizScore(quizScore + 1);
      coinsEarned = 25; // 25 coins per correct answer
      
      // Add to recent earnings
      const earning = {
        id: Date.now(),
        amount: coinsEarned,
        question: currentQuestion + 1,
        timestamp: new Date().toLocaleTimeString()
      };
      setRecentEarnings(prev => [earning, ...prev]);
      
      // Trigger coin animation
      animateCoinEarning(coinsEarned);
    }
    
    setShowExplanation(true);
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setQuizCompleted(true);
        // Bonus coins for completing quiz
        if (quizScore + (answerIndex === quizQuestions[currentQuestion].correct ? 1 : 0) > 0) {
          setTimeout(() => {
            const bonusCoins = 50;
            const bonusEarning = {
              id: Date.now(),
              amount: bonusCoins,
              question: 'Completion Bonus',
              timestamp: new Date().toLocaleTimeString()
            };
            setRecentEarnings(prev => [bonusEarning, ...prev]);
            animateCoinEarning(bonusCoins);
          }, 1000);
        }
      }
    }, 2500);
  };

  const makePrediction = (candidate) => {
    setPrediction(candidate);
    Alert.alert(
      "🎯 Prediction Locked!",
      `You bet on ${candidate.name} (${candidate.party}) as Bihar's next CM!\n\nOdds: ${candidate.odds}\nExperience: ${candidate.experience}`,
      [{ text: "🚀 Let's Go!" }]
    );
  };

  const getScoreEmoji = () => {
    const percentage = (quizScore / quizQuestions.length) * 100;
    if (percentage === 100) return "🏆";
    if (percentage >= 75) return "🥇";
    if (percentage >= 50) return "🥈";
    if (percentage >= 25) return "🥉";
    return "📚";
  };

  const renderWallet = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={walletVisible}
      onRequestClose={() => setWalletVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.walletContainer}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletTitle}>💰 Political Wallet</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setWalletVisible(false)}
            >
              <Ionicons name="close-circle" size={28} color="#667eea" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.coinBalance}>
            <Ionicons name="medal" size={40} color="#FFD700" />
            <Text style={styles.coinAmount}>{totalCoins}</Text>
            <Text style={styles.coinLabel}>Political Coins</Text>
          </View>
          
          <View style={styles.earningsSection}>
            <Text style={styles.earningsTitle}>🎯 Recent Earnings</Text>
            <ScrollView style={styles.earningsList}>
              {recentEarnings.length > 0 ? (
                recentEarnings.map((earning) => (
                  <View key={earning.id} style={styles.earningItem}>
                    <View style={styles.earningLeft}>
                      <Ionicons name="add-circle" size={20} color="#10B981" />
                      <Text style={styles.earningText}>
                        Question {earning.question}
                      </Text>
                    </View>
                    <View style={styles.earningRight}>
                      <Text style={styles.earningAmount}>+{earning.amount}</Text>
                      <Text style={styles.earningTime}>{earning.timestamp}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noEarnings}>
                  <Ionicons name="information-circle" size={40} color="#94A3B8" />
                  <Text style={styles.noEarningsText}>
                    Start playing quizzes to earn coins!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
          
          <View style={styles.walletFooter}>
            <View style={styles.coinInfo}>
              <Text style={styles.coinInfoText}>💡 Earn 25 coins per correct answer</Text>
              <Text style={styles.coinInfoText}>🎁 50 bonus coins for quiz completion</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderQuizContent = () => (
    <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
      {!quizCompleted ? (
        <>
          <View style={styles.quizHeader}>
            <Text style={styles.modalTitle}>🧠 Bihar Political Quiz</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.questionCounter}>
                {currentQuestion + 1}/{quizQuestions.length}
              </Text>
            </View>
          </View>
          
          <View style={styles.questionCard}>
            <Text style={styles.question}>
              {quizQuestions[currentQuestion].question}
            </Text>
          </View>
          
          {quizQuestions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && 
                (index === quizQuestions[currentQuestion].correct 
                  ? styles.correctAnswer 
                  : styles.wrongAnswer)
              ]}
              onPress={() => handleQuizAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText
              ]}>
                {option}
              </Text>
              {selectedAnswer === index && index === quizQuestions[currentQuestion].correct && (
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              )}
              {selectedAnswer === index && index !== quizQuestions[currentQuestion].correct && (
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              )}
            </TouchableOpacity>
          ))}
          
          {showExplanation && (
            <View style={styles.explanationCard}>
              <Text style={styles.explanationText}>
                💡 {quizQuestions[currentQuestion].explanation}
              </Text>
            </View>
          )}
          
          {/* Coin Animation Overlay */}
          {showCoinAnimation && (
            <View style={styles.coinAnimationOverlay}>
              {/* Sparkling Stars */}
              <Animated.View 
                style={[
                  styles.sparkleContainer,
                  {
                    opacity: sparkleAnim,
                    transform: [{
                      scale: sparkleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.2]
                      })
                    }]
                  }
                ]}
              >
                {[...Array(8)].map((_, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.sparkle,
                      {
                        transform: [
                          { rotate: `${i * 45}deg` },
                          { translateX: 40 },
                          { rotate: `-${i * 45}deg` }
                        ]
                      }
                    ]}
                  >
                    <Text style={styles.sparkleText}>✨</Text>
                  </Animated.View>
                ))}
              </Animated.View>
              
              {/* Coin Earning Animation */}
              <Animated.View 
                style={[
                  styles.coinEarning,
                  {
                    opacity: coinAnim,
                    transform: [{
                      translateY: coinAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -50]
                      })
                    }, {
                      scale: coinAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.5, 1.2, 1]
                      })
                    }]
                  }
                ]}
              >
                <Ionicons name="medal" size={32} color="#FFD700" />
                <Text style={styles.coinEarningText}>+{earnedCoins}</Text>
              </Animated.View>
            </View>
          )}
        </>
      ) : (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultEmoji}>{getScoreEmoji()}</Text>
          <Text style={styles.modalTitle}>Quiz Completed!</Text>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreText}>
              {quizScore}/{quizQuestions.length}
            </Text>
            <Text style={styles.scorePercentage}>
              {Math.round((quizScore / quizQuestions.length) * 100)}%
            </Text>
          </View>
          <Text style={styles.scoreDescription}>
            {quizScore === quizQuestions.length ? "🏆 Political Genius!" :
             quizScore >= 3 ? "🥇 Excellent Knowledge!" :
             quizScore >= 2 ? "🥈 Good Effort!" : "📚 Keep Learning!"}
          </Text>
          <TouchableOpacity style={styles.retakeButton} onPress={resetQuiz}>
            <Text style={styles.retakeButtonText}>🔄 Retake Quiz</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );

  const renderCMPrediction = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>👑 CM Prediction Arena</Text>
      <Text style={styles.subtitle}>Who will rule Bihar next?</Text>
      
      <View style={styles.predictionStats}>
        <Text style={styles.statsText}>🔥 Active Predictions: 1,247</Text>
      </View>
      
      {cmCandidates.map((candidate, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.candidateCard,
            prediction?.name === candidate.name && styles.selectedCandidateCard,
            { borderLeftColor: candidate.color }
          ]}
          onPress={() => makePrediction(candidate)}
        >
          <View style={styles.candidateHeader}>
            <View style={styles.candidateInfo}>
              <Text style={styles.candidateName}>{candidate.name}</Text>
              <Text style={styles.candidateParty}>{candidate.party}</Text>
            </View>
            <View style={styles.candidateStats}>
              <Text style={styles.odds}>🎯 {candidate.odds}</Text>
              <Text style={styles.experience}>{candidate.experience}</Text>
            </View>
          </View>
          <View style={styles.candidateFooter}>
            <Text style={styles.candidateAge}>Age: {candidate.age}</Text>
            {prediction?.name === candidate.name && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.selectedText}>Selected</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPartyBattle = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>⚔️ Alliance Battle Arena</Text>
      <Text style={styles.subtitle}>Political Warfare Prediction</Text>
      
      <View style={styles.battleArena}>
        <View style={[styles.allianceCard, styles.ndaCard]}>
          <View style={styles.allianceHeader}>
            <Text style={styles.allianceTitle}>🛡️ NDA Alliance</Text>
            <View style={styles.strengthMeter}>
              <View style={[styles.strengthBar, { width: '55%', backgroundColor: '#F59E0B' }]} />
            </View>
          </View>
          <Text style={styles.partyList}>JD(U) • BJP • LJP • HAM</Text>
          <View style={styles.predictionRow}>
            <Text style={styles.predictionLabel}>Predicted Seats:</Text>
            <Text style={styles.predictionValue}>125-135</Text>
          </View>
          <Text style={styles.winChance}>🎯 Win Chance: 55%</Text>
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.battleLine} />
        </View>
        
        <View style={[styles.allianceCard, styles.mahagathbandhanCard]}>
          <View style={styles.allianceHeader}>
            <Text style={styles.allianceTitle}>🤝 Mahagathbandhan</Text>
            <View style={styles.strengthMeter}>
              <View style={[styles.strengthBar, { width: '45%', backgroundColor: '#10B981' }]} />
            </View>
          </View>
          <Text style={styles.partyList}>RJD • Congress • Left Parties</Text>
          <View style={styles.predictionRow}>
            <Text style={styles.predictionLabel}>Predicted Seats:</Text>
            <Text style={styles.predictionValue}>108-118</Text>
          </View>
          <Text style={styles.winChance}>🎯 Win Chance: 45%</Text>
        </View>
      </View>
      
      <View style={styles.battleInsight}>
        <Text style={styles.insightTitle}>⚡ Battle Insight</Text>
        <Text style={styles.insightText}>
          Close fight expected! Rural vs Urban dynamics will decide the winner.
        </Text>
      </View>
    </View>
  );

  const renderGovtInfo = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>🏛️ Government Dashboard</Text>
      <Text style={styles.subtitle}>Current Political Landscape</Text>
      
      <View style={styles.govtDashboard}>
        <View style={[styles.govtCard, styles.cmCard]}>
          <View style={styles.govtCardHeader}>
            <Ionicons name="person-circle" size={40} color="#667eea" />
            <View>
              <Text style={styles.govtTitle}>Chief Minister</Text>
              <Text style={styles.govtValue}>Nitish Kumar</Text>
              <Text style={styles.govtParty}>JD(U) • 7th Term</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.govtCard, styles.deputyCmCard]}>
          <View style={styles.govtCardHeader}>
            <Ionicons name="people-circle" size={40} color="#f093fb" />
            <View>
              <Text style={styles.govtTitle}>Deputy CM</Text>
              <Text style={styles.govtValue}>Tejashwi Yadav</Text>
              <Text style={styles.govtParty}>RJD • 1st Term</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.govtCard, styles.allianceCard]}>
          <View style={styles.govtCardHeader}>
            <Ionicons name="shield-checkmark" size={40} color="#43e97b" />
            <View>
              <Text style={styles.govtTitle}>Ruling Alliance</Text>
              <Text style={styles.govtValue}>Mahagathbandhan</Text>
              <Text style={styles.govtParty}>RJD + JD(U) + Congress</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.govtCard, styles.strengthCard]}>
          <View style={styles.govtCardHeader}>
            <Ionicons name="analytics" size={40} color="#4facfe" />
            <View>
              <Text style={styles.govtTitle}>Assembly Strength</Text>
              <Text style={styles.govtValue}>164/243</Text>
              <Text style={styles.govtParty}>67.5% Majority</Text>
            </View>
          </View>
          <View style={styles.strengthVisual}>
            <View style={[styles.strengthBar, { width: '67.5%', backgroundColor: '#10B981' }]} />
          </View>
        </View>
      </View>
    </View>
  );

  const renderModalContent = () => {
    if (!currentSection) return null;
    
    switch (currentSection.type) {
      case 'quiz':
        return renderQuizContent();
      case 'cm_prediction':
        return renderCMPrediction();
      case 'party_battle':
        return renderPartyBattle();
      case 'govt_info':
        return renderGovtInfo();
      default:
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentSection.title}</Text>
            <View style={styles.comingSoonContainer}>
              <Ionicons name="construct" size={60} color="#667eea" />
              <Text style={styles.comingSoon}>Coming Soon!</Text>
              <Text style={styles.comingSoonSubtext}>
                This feature is under development
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enhanced Header with Gradient */}
        <View style={styles.header}>
          <View style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.appTitle}>🏛️ Bihar Political Arena</Text>
                <Text style={styles.appSubtitle}>राजनीतिक खेल • Political Gaming Hub</Text>
              </View>
              <View style={styles.headerActions}>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE PREDICTIONS</Text>
                </View>
                <TouchableOpacity 
                  style={styles.walletButton}
                  onPress={() => setWalletVisible(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="wallet" size={22} color="#FFD700" />
                  <Text style={styles.walletButtonText}>{totalCoins}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Enhanced Search */}
        <Animated.View 
          style={[
            styles.searchContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.searchBox}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search" size={20} color="#667eea" />
            </View>
            <TextInput
              placeholder='Search politics, quiz, predictions...'
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.micButton}>
              <Ionicons name="mic" size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Enhanced Games Grid */}
        <Text style={styles.sectionTitle}>🎮 Political Gaming Arena</Text>
        <Animated.View 
          style={[
            styles.grid,
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }] 
            }
          ]}
        >
          {quizSections.map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.gameCard}
              activeOpacity={0.9}
              onPress={() => handleSectionPress(item)}
            >
              <View style={[styles.gameCardGradient, { backgroundColor: item.gradient[0] }]}>
                <View style={styles.gameCardContent}>
                  <View style={styles.gameIconContainer}>
                    <Ionicons name={item.icon} size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.gameTitle}>{item.title}</Text>
                  <Text style={styles.gameSubtitle}>{item.subtitle}</Text>
                  <View style={styles.playButton}>
                    <Ionicons name="play" size={16} color={item.gradient[0]} />
                    <Text style={[styles.playText, { color: item.gradient[0] }]}>PLAY</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Enhanced Hero Carousel */}
        <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carouselContainer}
        >
          {heroCarousel.map((item, idx) => (
            <View key={idx} style={styles.heroCard}>
              <Image source={{ uri: item.uri }} style={styles.heroImage} />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>{item.title}</Text>
                <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Enhanced Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close-circle" size={32} color="#667eea" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderModalContent()}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Wallet Modal */}
      {renderWallet()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },

  // Enhanced Header
  header: {
    height: 180,
    overflow: 'hidden',
    backgroundColor: '#667eea',
  },
  headerGradient: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    justifyContent: 'space-between',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    letterSpacing: 1,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  walletButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Enhanced Search
  searchContainer: {
    marginHorizontal: 16,
    marginTop: -30,
    zIndex: 10,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  searchIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  micButton: {
    padding: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 16,
    color: '#1E293B',
  },

  // Enhanced Game Cards
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gameCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  gameCardGradient: {
    minHeight: 160,
    justifyContent: 'flex-end',
  },
  gameCardContent: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    margin: 2,
    borderRadius: 14,
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  playText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Enhanced Carousel
  carouselContainer: {
    marginBottom: 30,
  },
  heroCard: {
    width: width - 32,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  heroImage: {
    width: '100%',
    height: 180,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },

  // Enhanced Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },

  // Enhanced Quiz Styles
  quizHeader: {
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 4,
  },
  questionCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  questionCard: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  correctAnswer: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  wrongAnswer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  explanationCard: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  explanationText: {
    fontSize: 14,
    color: '#92400E',
    fontStyle: 'italic',
  },
  resultsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  scoreCard: {
    backgroundColor: '#F8FAFC',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 16,
    minWidth: 120,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
  },
  scorePercentage: {
    fontSize: 18,
    color: '#64748B',
    marginTop: 4,
  },
  scoreDescription: {
    fontSize: 18,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  retakeButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Enhanced CM Prediction Styles
  predictionStats: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
  },
  candidateCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCandidateCard: {
    backgroundColor: '#F0F9FF',
    borderColor: '#3B82F6',
  },
  candidateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  candidateParty: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  candidateStats: {
    alignItems: 'flex-end',
  },
  odds: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  experience: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  candidateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  candidateAge: {
    fontSize: 12,
    color: '#64748B',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '600',
  },

  // Enhanced Party Battle Styles
  battleArena: {
    marginVertical: 20,
  },
  allianceCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ndaCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  mahagathbandhanCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  allianceHeader: {
    marginBottom: 12,
  },
  allianceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  strengthMeter: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 3,
  },
  partyList: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  predictionLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  winChance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  vsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  battleLine: {
    width: 60,
    height: 2,
    backgroundColor: '#667eea',
  },
  battleInsight: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },

  // Enhanced Government Dashboard
  govtDashboard: {
    marginTop: 16,
  },
  govtCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cmCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  deputyCmCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f093fb',
  },
  allianceCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#43e97b',
  },
  strengthCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4facfe',
  },
  govtCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  govtTitle: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 12,
  },
  govtValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 12,
  },
  govtParty: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 12,
    marginTop: 2,
  },
  strengthVisual: {
    marginTop: 12,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
  },

  // Coming Soon
  comingSoonContainer: {
    alignItems: 'center',
    padding: 40,
  },
  comingSoon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 16,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },

  // Wallet Styles
  walletContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '60%',
    paddingBottom: 20,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  walletTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  coinBalance: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'linear-gradient(135deg, #FFD700, #FFA500)',
    margin: 20,
    borderRadius: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  coinAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 8,
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  coinLabel: {
    fontSize: 16,
    color: '#1E293B',
    marginTop: 4,
    fontWeight: '600',
  },
  earningsSection: {
    paddingHorizontal: 20,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  earningsList: {
    maxHeight: 200,
  },
  earningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  earningLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  earningText: {
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 8,
  },
  earningRight: {
    alignItems: 'flex-end',
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  earningTime: {
    fontSize: 12,
    color: '#64748B',
  },
  noEarnings: {
    alignItems: 'center',
    padding: 30,
  },
  noEarningsText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },
  walletFooter: {
    padding: 20,
  },
  coinInfo: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
  },
  coinInfoText: {
    fontSize: 14,
    color: '#0369A1',
    marginVertical: 2,
  },

  // Coin Animation Styles
  coinAnimationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  sparkleContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleText: {
    fontSize: 20,
  },
  coinEarning: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  coinEarningText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 4,
  },
});

export default BiharPoliticalApp;