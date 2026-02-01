"""
Raspberry Pi Flask Server for StoryRover Robot
This receives commands from the NestJS backend and controls the robot
"""

from flask import Flask, request, jsonify
import serial
import time
import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Default voice, change as needed
ARDUINO_PORT = '/dev/ttyUSB0'  # or /dev/ttyACM0
BAUD_RATE = 9600

# Initialize Arduino connection (optional - comment out if not ready yet)
try:
    arduino = serial.Serial(ARDUINO_PORT, BAUD_RATE, timeout=1)
    time.sleep(2)  # Wait for Arduino to initialize
    print("✅ Arduino connected")
    ARDUINO_CONNECTED = True
except Exception as e:
    print(f"⚠️  Arduino not connected: {e}")
    print("   Robot will work without movement for testing")
    ARDUINO_CONNECTED = False
    arduino = None

def move_to_zone(zone):
    """
    Send movement commands to Arduino to navigate to the specified zone
    """
    if not ARDUINO_CONNECTED:
        print(f"🤖 Would move to {zone} zone (Arduino not connected)")
        return
    
    # Zone movement commands (customize based on your robot's calibration)
    movements = {
        'red': b'<RED>',      # Spend zone (left)
        'blue': b'<BLUE>',    # Save zone (forward)
        'yellow': b'<YELLOW>',# Invest zone (right)
        'center': b'<STOP>' # Return to start
    }
    
    if zone in movements:
        try:
            print(f"🤖 Moving to {zone.upper()} zone...")
            arduino.write(movements[zone])
            arduino.flush()
            
            # Wait for movement to complete (adjust timing as needed)
            time.sleep(15.5)
            
            print(f"✅ Reached {zone} zone")
        except Exception as e:
            print(f"❌ Movement failed: {e}")
    else:
        print(f"❌ Unknown zone: {zone}")



@app.route('/health', methods=['GET'])
def health():
    """
    Health check endpoint - backend uses this to verify connection
    """
    return jsonify({
        "status": "ok",
        "message": "StoryRover Pi is ready!",
        "arduino_connected": ARDUINO_CONNECTED,
        "elevenlabs_enabled": ELEVENLABS_API_KEY != 'your_key_here'
    })


@app.route('/command', methods=['POST'])
def handle_command():
    """
    Main command handler - receives instructions from the backend
    
    Expected JSON format:
    {
        "text": "The text to speak",
        "zone": "red|blue|yellow|center",
        "emotion": "happy|sad|neutral|excited"
    }
    """
    try:
        data = request.json
        text = data.get('text', '')
        zone = data.get('zone', 'center')
        emotion = data.get('emotion', 'neutral')
        
        print("\n" + "="*50)
        print(f"📡 Received command:")
        print(f"   Zone: {zone}")
        print(f"   Text: {text}")
        print(f"   Emotion: {emotion}")
        print("="*50)
        
        # Move robot in background thread
        import threading
        thread = threading.Thread(target=move_to_zone, args=(zone,))
        thread.start()

        # Respond immediately, don't wait for movement
        return jsonify({
            "status": "success",
            "message": f"Executed command for {zone} zone"
        })
        
    except Exception as e:
        print(f"❌ Error handling command: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    
@app.route('/test-movement', methods=['POST'])
def test_movement():
    """
    Test endpoint for manual movement testing
    """
    data = request.json
    zone = data.get('zone', 'center')
    
    print(f"🧪 Testing movement to {zone}")
    move_to_zone(zone)
    
    return jsonify({"status": "success", "zone": zone})


@app.route('/test-speech', methods=['POST'])
def test_speech():
    """
    Test endpoint for manual speech testing
    """
    data = request.json
    text = data.get('text', 'Testing speech synthesis')
    
    print(f"🧪 Testing speech: {text}")
    speak_with_elevenlabs(text)
    
    return jsonify({"status": "success"})


if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 StoryRover Raspberry Pi Server Starting...")
    print("="*60)
    print(f"Arduino: {'✅ Connected' if ARDUINO_CONNECTED else '⚠️  Not connected (mock mode)'}")
    print(f"ElevenLabs: {'✅ Enabled' if ELEVENLABS_API_KEY != 'your_key_here' else '⚠️  Disabled (set API key)'}")
    print("="*60)
    print("Server will run on http://0.0.0.0:5000")
    print("Make sure your laptop can reach this IP address!")
    print("="*60 + "\n")
    
    # Run the Flask server
    app.run(
        host='0.0.0.0',  # Listen on all network interfaces
        port=5000,
        debug=True
    )
