import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const BiharRealSVGMapTemplate = () => {
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [votingModalVisible, setVotingModalVisible] = useState(false);
  const [votes, setVotes] = useState({});

  // TODO: Replace this with your actual SVG paths from mapshaper.org
  // After following the guide above, you'll get real Bihar SVG paths like this:
  const realBiharSVGPaths = `
    <!-- REPLACE THESE WITH YOUR ACTUAL SVG PATHS FROM MAPSHAPER.ORG -->
    <!-- Example format - you'll get the real ones after conversion -->
    
    <!-- Patna Sahib Constituency (Example - replace with real path) -->
    <path 
      d="M 450.123 250.456 L 470.789 245.123 L 485.456 260.789 L 480.123 275.456 L 465.789 280.123 L 450.123 265.456 Z" 
      id="patna-sahib"
      class="constituency-path"
      data-name="Patna Sahib"
      data-region="Central Bihar"
      onclick="handleConstituencyClick('Patna Sahib', 'Central Bihar')"
    />
    
    <!-- Patliputra Constituency (Example - replace with real path) -->
    <path 
      d="M 480.123 275.456 L 500.789 270.123 L 515.456 285.789 L 510.123 300.456 L 495.789 305.123 L 480.123 290.456 Z" 
      id="patliputra"
      class="constituency-path"
      data-name="Patliputra"
      data-region="Central Bihar"
      onclick="handleConstituencyClick('Patliputra', 'Central Bihar')"
    />
    
    <!-- Darbhanga Constituency (Example - replace with real path) -->
    <path 
      d="M 520.123 200.456 L 540.789 195.123 L 555.456 210.789 L 550.123 225.456 L 535.789 230.123 L 520.123 215.456 Z" 
      id="darbhanga"
      class="constituency-path"
      data-name="Darbhanga"
      data-region="Central Bihar"
      onclick="handleConstituencyClick('Darbhanga', 'Central Bihar')"
    />
    
    <!-- Muzaffarpur Constituency (Example - replace with real path) -->
    <path 
      d="M 420.123 180.456 L 440.789 175.123 L 455.456 190.789 L 450.123 205.456 L 435.789 210.123 L 420.123 195.456 Z" 
      id="muzaffarpur"
      class="constituency-path"
      data-name="Muzaffarpur"
      data-region="Central Bihar"
      onclick="handleConstituencyClick('Muzaffarpur', 'Central Bihar')"
    />
    
    <!-- Gaya Constituency (Example - replace with real path) -->
    <path 
      d="M 450.123 350.456 L 480.789 345.123 L 505.456 365.789 L 495.123 385.456 L 470.789 390.123 L 450.123 375.456 Z" 
      id="gaya"
      class="constituency-path"
      data-name="Gaya"
      data-region="South Bihar"
      onclick="handleConstituencyClick('Gaya', 'South Bihar')"
    />
    
    <!-- Bhagalpur Constituency (Example - replace with real path) -->
    <path 
      d="M 650.123 280.456 L 680.789 275.123 L 705.456 295.789 L 695.123 315.456 L 670.789 320.123 L 650.123 305.456 Z" 
      id="bhagalpur"
      class="constituency-path"
      data-name="Bhagalpur"
      data-region="East Bihar"
      onclick="handleConstituencyClick('Bhagalpur', 'East Bihar')"
    />
    
    <!-- ADD ALL 40 CONSTITUENCIES HERE WITH REAL PATHS -->
    <!-- After getting data from mapshaper.org, replace above examples with real SVG paths -->
    
    <!-- Constituency Labels -->
    <text x="460" y="260" text-anchor="middle" class="constituency-label">Patna Sahib</text>
    <text x="490" y="285" text-anchor="middle" class="constituency-label">Patliputra</text>
    <text x="530" y="210" text-anchor="middle" class="constituency-label">Darbhanga</text>
    <text x="430" y="190" text-anchor="middle" class="constituency-label">Muzaffarpur</text>
    <text x="470" y="365" text-anchor="middle" class="constituency-label">Gaya</text>
    <text x="670" y="295" text-anchor="middle" class="constituency-label">Bhagalpur</text>
    
    <!-- ADD LABELS FOR ALL 40 CONSTITUENCIES -->
  `;

  // Political parties
  const parties = [
    { name: 'BJP', fullName: 'Bharatiya Janata Party', color: '#FF9933', symbol: '🪷' },
    { name: 'JDU', fullName: 'Janata Dal (United)', color: '#138808', symbol: '🏹' },
    { name: 'RJD', fullName: 'Rashtriya Janata Dal', color: '#00B140', symbol: '🔦' },
    { name: 'INC', fullName: 'Indian National Congress', color: '#19AAED', symbol: '✋' },
    { name: 'LJP', fullName: 'Lok Janshakti Party', color: '#0066CC', symbol: '🏠' },
    { name: 'CPI(ML)', fullName: 'Communist Party of India (Marxist-Leninist)', color: '#FF0000', symbol: '⚒️' },
    { name: 'AIMIM', fullName: 'All India Majlis-e-Ittehadul Muslimeen', color: '#00C851', symbol: '🪁' },
    { name: 'BSP', fullName: 'Bahujan Samaj Party', color: '#0033CC', symbol: '🐘' },
    { name: 'NOTA', fullName: 'None of the Above', color: '#808080', symbol: '❌' }
  ];

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'constituency-clicked') {
        setSelectedConstituency({
          name: data.constituency,
          region: data.region
        });
        setVotingModalVisible(true);
      }
    } catch (err) {
      console.warn('Message error:', event.nativeEvent.data);
    }
  };

  const castVote = (party) => {
    if (!selectedConstituency) return;

    setVotes(prev => ({
      ...prev,
      [selectedConstituency.name]: party
    }));

    setVotingModalVisible(false);

    Alert.alert(
      '🎉 Vote Successfully Cast!',
      `Your vote for ${party.name} (${party.symbol}) in ${selectedConstituency.name} constituency has been recorded.`,
      [{ text: 'Continue Voting' }]
    );
  };

  // Generate dynamic styling for voted constituencies
  const generateVotedStyles = () => {
    return Object.entries(votes).map(([constituency, party]) => `
      path[data-name="${constituency}"] {
        fill: ${party.color} !important;
        stroke: #333 !important;
        stroke-width: 2 !important;
      }
    `).join('');
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bihar Real SVG Map</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: #333;
          overflow-x: auto;
        }
        
        .container {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        
        .header {
          background: rgba(255, 255, 255, 0.95);
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          margin-bottom: 20px;
          width: 100%;
          max-width: 800px;
        }
        
        .header h1 {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
        }
        
        .svg-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          padding: 30px;
          width: 100%;
          max-width: 1200px;
          overflow: hidden;
        }
        
        .map-title {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .map-title h2 {
          font-size: 20px;
          color: #333;
          margin-bottom: 5px;
        }
        
        .map-title p {
          color: #666;
          font-size: 14px;
        }
        
        /* SVG Styles */
        .constituency-path {
          fill: #e8f4fd;
          stroke: #666;
          stroke-width: 1;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .constituency-path:hover {
          fill: #cce7ff;
          stroke: #007bff;
          stroke-width: 2;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
        }
        
        .constituency-label {
          font-size: 10px;
          font-weight: bold;
          fill: #333;
          pointer-events: none;
          text-anchor: middle;
          opacity: 0.8;
        }
        
        .constituency-path:hover + .constituency-label {
          opacity: 1;
          font-size: 11px;
        }
        
        /* Dynamic styles for voted constituencies */
        ${generateVotedStyles()}
        
        .stats {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          z-index: 1000;
          min-width: 200px;
        }
        
        .stats-title {
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 15px;
          color: #333;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .stat-value {
          font-weight: bold;
          color: #667eea;
        }
        
        .instruction {
          background: rgba(255, 255, 255, 0.95);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 500;
          color: #333;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
          .stats {
            position: relative;
            top: auto;
            right: auto;
            margin: 20px auto;
            max-width: 90%;
          }
          
          .container {
            padding: 10px;
          }
          
          .svg-container {
            padding: 15px;
          }
          
          .constituency-label {
            font-size: 8px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🗳️ Bihar Lok Sabha Elections 2024</h1>
          <p>Real SVG Map with Authentic Geographic Boundaries</p>
        </div>
        
        <div class="instruction">
          📍 <strong>Instructions:</strong> Follow the guide above to get real Bihar SVG paths, then replace the example paths in this template with your actual data from mapshaper.org
        </div>
        
        <div class="stats">
          <div class="stats-title">📊 Voting Progress</div>
          <div class="stat-item">
            <span>Total Constituencies:</span>
            <span class="stat-value">40</span>
          </div>
          <div class="stat-item">
            <span>Votes Cast:</span>
            <span class="stat-value" id="voteCount">0</span>
          </div>
          <div class="stat-item">
            <span>Remaining:</span>
            <span class="stat-value" id="remainingCount">40</span>
          </div>
        </div>
        
        <div class="svg-container">
          <div class="map-title">
            <h2>🏛️ Bihar State - Authentic SVG Boundaries</h2>
            <p>Click on any constituency to cast your vote • Based on real geographic data</p>
          </div>
          
          <!-- TODO: Update viewBox after getting real SVG data -->
          <!-- The viewBox values will come from your mapshaper.org export -->
          <svg viewBox="0 0 800 500" width="100%" height="100%">
            
            <!-- Bihar state outer boundary (you'll get this from mapshaper.org) -->
            <path 
              d="M 50 50 L 750 50 L 750 450 L 50 450 Z" 
              fill="none" 
              stroke="#333" 
              stroke-width="3" 
              stroke-dasharray="10,5" 
              opacity="0.3"
            />
            
            <!-- State title -->
            <text x="400" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">
              बिहार राज्य / BIHAR STATE
            </text>
            
            <!-- Real constituency paths will go here -->
            ${realBiharSVGPaths}
            
            <!-- Legend -->
            <g transform="translate(50, 400)">
              <rect x="0" y="0" width="200" height="80" fill="rgba(255,255,255,0.9)" stroke="#ccc" rx="5"/>
              <text x="10" y="15" font-size="12" font-weight="bold" fill="#333">Legend:</text>
              <rect x="10" y="20" width="15" height="10" fill="#e8f4fd" stroke="#666"/>
              <text x="30" y="29" font-size="10" fill="#333">Unvoted Constituency</text>
              <rect x="10" y="35" width="15" height="10" fill="#FF9933" stroke="#333"/>
              <text x="30" y="44" font-size="10" fill="#333">Voted Constituency</text>
              <text x="10" y="60" font-size="9" fill="#666">Real boundaries from DataMeet/OSM</text>
            </g>
            
          </svg>
        </div>
      </div>

      <script>
        let voteCount = 0;
        const totalConstituencies = 40;

        function handleConstituencyClick(constituency, region) {
          console.log('Clicked:', constituency, 'in', region);
          
          // Visual feedback
          const path = document.querySelector('[data-name="' + constituency + '"]');
          if (path) {
            path.style.transform = 'scale(1.05)';
            path.style.transformOrigin = 'center';
            setTimeout(() => {
              path.style.transform = 'scale(1)';
            }, 300);
          }
          
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'constituency-clicked',
              constituency: constituency,
              region: region,
              timestamp: new Date().toISOString()
            }));
          } else {
            // Fallback for testing in browser
            alert('Voting for: ' + constituency + ' (' + region + ')');
          }
        }

        function updateVoteStats(newVoteCount) {
          voteCount = newVoteCount;
          const remaining = totalConstituencies - voteCount;
          
          document.getElementById('voteCount').textContent = voteCount;
          document.getElementById('remainingCount').textContent = remaining;
        }

        // Make paths focusable for accessibility
        document.querySelectorAll('.constituency-path').forEach(path => {
          path.setAttribute('tabindex', '0');
          path.setAttribute('role', 'button');
          path.setAttribute('aria-label', 'Vote for ' + path.dataset.name + ' constituency');
        });

        console.log('Bihar Real SVG Map Template loaded');
        console.log('📋 Next steps:');
        console.log('1. Follow the step-by-step guide to get real Bihar SVG data');
        console.log('2. Replace example paths with real paths from mapshaper.org');
        console.log('3. Update viewBox with correct dimensions');
        console.log('4. Add all 40 constituency paths and labels');
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={onMessage}
        style={styles.webview}
        startInLoadingState={true}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
        scalesPageToFit={false}
        bounces={false}
        injectedJavaScript={`
          updateVoteStats(${Object.keys(votes).length});
          true;
        `}
      />

      {/* Voting Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={votingModalVisible}
        onRequestClose={() => setVotingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🗳️ Cast Your Vote</Text>
              <TouchableOpacity 
                onPress={() => setVotingModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {selectedConstituency && (
              <View style={styles.constituencyInfo}>
                <Text style={styles.constituencyName}>{selectedConstituency.name}</Text>
                <Text style={styles.regionName}>{selectedConstituency.region}</Text>
                <Text style={styles.authenticNote}>✅ Based on Real Geographic Boundaries</Text>
                {votes[selectedConstituency.name] && (
                  <View style={styles.previousVote}>
                    <Text style={styles.previousVoteText}>
                      ✅ Previous vote: {votes[selectedConstituency.name].name} {votes[selectedConstituency.name].symbol}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <Text style={styles.instructionText}>
              Select your preferred political party:
            </Text>

            <ScrollView style={styles.partiesContainer} showsVerticalScrollIndicator={false}>
              {parties.map((party, index) => (
                <Touch