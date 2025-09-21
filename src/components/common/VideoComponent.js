import React from "react";
import { View } from "react-native";
import YouTube from "react-native-youtube-iframe";

const VideoComponent = ({ source = "9-148GVcbi8" }) => {
  try {
    return (
      <View style={{ height: 200 }}>
        <YouTube
          videoId={source}
          height={200}
          play={false} // Set to true if you want the video to start playing automatically
          style={{ alignSelf: "stretch", flex: 1 }}
        />
      </View>
    );
  } catch (error) {
    console.error("YouTube Rendering Error:", error);
    return null;
  }
};

export default VideoComponent;
