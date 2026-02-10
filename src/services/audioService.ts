import { Audio } from 'expo-av';

export interface RecordingStatus {
    isRecording: boolean;
    isPaused: boolean;
    duration: number;
    uri?: string;
}

class AudioService {
    private recording: Audio.Recording | null = null;
    private recordingStatus: RecordingStatus = {
        isRecording: false,
        isPaused: false,
        duration: 0,
    };

    /**
     * Initialize audio permissions and settings
     */
    async initialize(): Promise<boolean> {
        try {
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status !== 'granted') {
                console.error('Audio permission not granted');
                return false;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
            });

            return true;
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            return false;
        }
    }

    /**
     * Start recording audio
     */
    async startRecording(): Promise<boolean> {
        try {
            // Request permissions
            const hasPermission = await this.initialize();
            if (!hasPermission) {
                return false;
            }

            // Create new recording
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            this.recording = recording;
            this.recordingStatus.isRecording = true;
            this.recordingStatus.isPaused = false;

            // Set up status update listener
            recording.setOnRecordingStatusUpdate((status) => {
                if (status.isRecording) {
                    this.recordingStatus.duration = status.durationMillis;
                }
            });

            return true;
        } catch (error) {
            console.error('Failed to start recording:', error);
            return false;
        }
    }

    /**
     * Pause the current recording
     */
    async pauseRecording(): Promise<boolean> {
        try {
            if (!this.recording) {
                return false;
            }

            await this.recording.pauseAsync();
            this.recordingStatus.isPaused = true;
            return true;
        } catch (error) {
            console.error('Failed to pause recording:', error);
            return false;
        }
    }

    /**
     * Resume the paused recording
     */
    async resumeRecording(): Promise<boolean> {
        try {
            if (!this.recording) {
                return false;
            }

            await this.recording.startAsync();
            this.recordingStatus.isPaused = false;
            return true;
        } catch (error) {
            console.error('Failed to resume recording:', error);
            return false;
        }
    }

    /**
     * Stop recording and get the file URI
     */
    async stopRecording(): Promise<string | null> {
        try {
            if (!this.recording) {
                return null;
            }

            await this.recording.stopAndUnloadAsync();
            const uri = this.recording.getURI();

            // Reset state
            this.recording = null;
            this.recordingStatus = {
                isRecording: false,
                isPaused: false,
                duration: 0,
            };

            return uri;
        } catch (error) {
            console.error('Failed to stop recording:', error);
            return null;
        }
    }

    /**
     * Get current recording status
     */
    getStatus(): RecordingStatus {
        return { ...this.recordingStatus };
    }

    /**
     * Format duration in milliseconds to MM:SS
     */
    formatDuration(milliseconds: number): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

export default new AudioService();
