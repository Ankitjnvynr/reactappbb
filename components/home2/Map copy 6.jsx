import React from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const DatawrapperVotingMap = () => {
  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'constituency-clicked') {
        Alert.alert(
          'Vote',
          `Do you want to vote for ${data.constituency}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Vote',
              onPress: () => {
                Alert.alert('Success', `Your vote for ${data.constituency} has been recorded.`);
                // You can send this to a backend here
              },
            },
          ]
        );
      }
    } catch (err) {
      console.warn('Invalid message format from iframe:', event.nativeEvent.data);
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          background: white;
        }
        iframe {
          width: 100%;
          height: 600px;
          border: none;
        }
        #vote-overlay {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.7);
          color: #fff;
          padding: 10px 15px;
          border-radius: 8px;
          font-family: sans-serif;
          cursor: pointer;
          z-index: 9999;
        }
      </style>
    </head>
    <body>
      <iframe 
        title="Bihar Map" 
        src="https://datawrapper.dwcdn.net/BOCDS/1/" 
        scrolling="no"
        id="datawrapper-map"
        data-external="1"
        style="border:none;"
      ></iframe>

      <!-- Simulated click button -->
      <div id="vote-overlay">Tap here to vote "Patna"</div>

      <script>
        (function() {
          // Handle Datawrapper auto-height
          window.addEventListener("message", function(event) {
            if (event.data["datawrapper-height"]) {
              var iframes = document.querySelectorAll("iframe");
              for (var chartId in event.data["datawrapper-height"]) {
                for (var i = 0; i < iframes.length; i++) {
                  if (iframes[i].contentWindow === event.source) {
                    iframes[i].style.height = event.data["datawrapper-height"][chartId] + "px";
                  }
                }
              }
            }
          });

          // Simulated vote trigger
          document.getElementById('vote-overlay').addEventListener('click', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'constituency-clicked',
              constituency: 'Patna'
            }));
          });
        })();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onMessage={onMessage}
        style={styles.webview}
      />
    </View>
  );
};

export default DatawrapperVotingMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    width: width,
    flex: 1,
  },
});
