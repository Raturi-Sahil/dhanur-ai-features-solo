import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import audioService from '../services/audioService';
import ScriptItem from '../components/ScriptItem';
import { Script } from '../types';

type RecordingState = 'idle' | 'recording' | 'paused' | 'finished';

export default function RecorderScreen() {
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [duration, setDuration] = useState<number>(0);
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [transcriptText, setTranscriptText] = useState<string>('');
    const [scriptTitle, setScriptTitle] = useState<string>('');
    const [savedScripts, setSavedScripts] = useState<Script[]>([]);
    const [editingScript, setEditingScript] = useState<Script | null>(null);
    const [recognizing, setRecognizing] = useState<boolean>(false);

    // Listen for speech recognition results
    useSpeechRecognitionEvent('result', (event) => {
        const transcript = event.results[0]?.transcript || '';
        setTranscriptText(transcript);
    });

    // Load saved scripts on mount
    useEffect(() => {
        loadScripts();
    }, []);

    // Update timer while recording
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (recordingState === 'recording') {
            interval = setInterval(() => {
                const status = audioService.getStatus();
                setDuration(status.duration);
            }, 100);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [recordingState]);

    const loadScripts = async () => {
        try {
            const data = await AsyncStorage.getItem('@scripts');
            const scripts = data ? JSON.parse(data) : [];
            const parsedScripts = scripts.map((s: any) => ({
                ...s,
                createdAt: new Date(s.createdAt),
            }));
            setSavedScripts(parsedScripts);
        } catch (error) {
            console.error('Failed to load scripts:', error);
        }
    };

    const handleStartRecording = async () => {
        // Request speech recognition permission
        const { status } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Speech recognition permission is required for voice-to-text.');
            return;
        }

        // Start audio recording
        const success = await audioService.startRecording();
        if (success) {
            setRecordingState('recording');
            setDuration(0);

            // Start speech recognition
            try {
                await ExpoSpeechRecognitionModule.start({
                    lang: 'en-US',
                    interimResults: true,
                    maxAlternatives: 1,
                    continuous: true,
                });
                setRecognizing(true);
            } catch (error) {
                console.error('Speech recognition error:', error);
            }
        } else {
            Alert.alert('Error', 'Failed to start recording. Please check microphone permissions.');
        }
    };

    const handlePauseRecording = async () => {
        const success = await audioService.pauseRecording();
        if (success) {
            setRecordingState('paused');
        }
    };

    const handleResumeRecording = async () => {
        const success = await audioService.resumeRecording();
        if (success) {
            setRecordingState('recording');
        }
    };

    const handleStopRecording = async () => {
        const uri = await audioService.stopRecording();

        // Stop speech recognition
        if (recognizing) {
            await ExpoSpeechRecognitionModule.stop();
            setRecognizing(false);
        }

        if (uri) {
            setAudioUri(uri);

            // If no transcript, go back to idle instead of showing finished with nothing to save
            if (!transcriptText.trim()) {
                setRecordingState('idle');
                setAudioUri(null); // Clear the audio file since we won't save it
            } else {
                setRecordingState('finished');
            }
        }
    };

    const handleSave = async () => {
        if (!transcriptText.trim()) {
            Alert.alert('Empty Script', 'Please enter some text for your script.');
            return;
        }

        try {
            const title = scriptTitle.trim() || `Script ${new Date().toLocaleString()}`;
            const data = await AsyncStorage.getItem('@scripts');
            const scripts = data ? JSON.parse(data) : [];

            if (editingScript) {
                // Update existing script
                const index = scripts.findIndex((s: Script) => s.id === editingScript.id);
                if (index !== -1) {
                    scripts[index] = { ...scripts[index], title, content: transcriptText };
                }
                Alert.alert('Success', 'Script updated!');
                setEditingScript(null);
            } else {
                // Save new script
                const newScript: Script = {
                    id: Date.now().toString(),
                    title,
                    content: transcriptText,
                    createdAt: new Date(),
                    audioUri: audioUri || undefined,
                    duration,
                };
                scripts.unshift(newScript);
                Alert.alert('Success', 'Script saved!');
            }

            await AsyncStorage.setItem('@scripts', JSON.stringify(scripts));
            await loadScripts();
            handleReset();
        } catch (error) {
            Alert.alert('Error', 'Failed to save script. Please try again.');
            console.error('Save error:', error);
        }
    };

    const handleEdit = (script: Script) => {
        setEditingScript(script);
        setScriptTitle(script.title);
        setTranscriptText(script.content);
        setRecordingState('idle');
    };

    const handleDelete = async (id: string) => {
        try {
            const data = await AsyncStorage.getItem('@scripts');
            const scripts = data ? JSON.parse(data) : [];
            const filtered = scripts.filter((s: Script) => s.id !== id);
            await AsyncStorage.setItem('@scripts', JSON.stringify(filtered));
            await loadScripts();
            Alert.alert('Success', 'Script deleted!');
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleReset = () => {
        setRecordingState('idle');
        setDuration(0);
        setAudioUri(null);
        setTranscriptText('');
        setScriptTitle('');
        setEditingScript(null);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Timer Display */}
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                    {audioService.formatDuration(duration)}
                </Text>
                <Text style={styles.timerLabel}>
                    {recordingState === 'idle' && (editingScript ? 'Editing Script' : 'Ready to Record')}
                    {recordingState === 'recording' && (recognizing ? 'Recording & Transcribing...' : 'Recording...')}
                    {recordingState === 'paused' && 'Paused'}
                    {recordingState === 'finished' && 'Recording Complete'}
                </Text>
            </View>

            {/* Microphone Controls */}
            <View style={styles.micContainer}>
                {recordingState === 'idle' && (
                    <TouchableOpacity
                        style={[styles.micButton, styles.micButtonStart]}
                        onPress={handleStartRecording}
                    >
                        <Ionicons name="mic" size={60} color="#FFFFFF" />
                    </TouchableOpacity>
                )}

                {recordingState === 'recording' && (
                    <TouchableOpacity
                        style={[styles.micButton, styles.micButtonRecording]}
                        onPress={handlePauseRecording}
                    >
                        <Ionicons name="pause" size={60} color="#FFFFFF" />
                    </TouchableOpacity>
                )}

                {recordingState === 'paused' && (
                    <View style={styles.pausedControls}>
                        <TouchableOpacity
                            style={[styles.controlButton, styles.resumeButton]}
                            onPress={handleResumeRecording}
                        >
                            <Ionicons name="play" size={32} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.controlButton, styles.stopButton]}
                            onPress={handleStopRecording}
                        >
                            <Ionicons name="stop" size={32} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                )}

                {recordingState === 'finished' && (
                    <View style={styles.finishedIcon}>
                        <Ionicons name="checkmark-circle" size={100} color="#00D9E1" />
                    </View>
                )}
            </View>

            {/* Script Title Input - Always visible when not recording */}
            {recordingState !== 'recording' && (
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Script Title</Text>
                    <TextInput
                        style={styles.titleInput}
                        value={scriptTitle}
                        onChangeText={setScriptTitle}
                        placeholder="Enter script title (optional)"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                    />
                </View>
            )}

            {/* Text Editor - Always visible */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                    {recordingState === 'recording'
                        ? '📝 Type while recording:'
                        : recordingState === 'finished'
                            ? 'Enter your script:'
                            : editingScript
                                ? 'Edit your script:'
                                : 'Or type your script directly:'}
                </Text>
                <TextInput
                    style={styles.textInput}
                    value={transcriptText}
                    onChangeText={setTranscriptText}
                    placeholder="Type your script here..."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    multiline
                    numberOfLines={8}
                    textAlignVertical="top"
                />
            </View>

            {/* Action Buttons */}
            {(recordingState === 'finished' || recordingState === 'idle') && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.saveButton, !transcriptText.trim() && styles.buttonDisabled]}
                        onPress={handleSave}
                        disabled={!transcriptText.trim()}
                    >
                        <Ionicons name="save" size={24} color="#FFFFFF" />
                        <Text style={styles.buttonText}>
                            {editingScript ? 'Update Script' : 'Save Script'}
                        </Text>
                    </TouchableOpacity>

                    {(transcriptText.trim() || editingScript) && (
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Ionicons name="refresh" size={24} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Saved Scripts Section */}
            {(() => {
                console.log('🎨 Rendering saved scripts, count:', savedScripts.length);
                return null;
            })()}
            {savedScripts.length > 0 && (
                <View style={styles.savedScriptsSection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="document-text" size={24} color="#00D9E1" />
                        <Text style={styles.sectionTitle}>Saved Scripts ({savedScripts.length})</Text>
                    </View>

                    {savedScripts.map((script) => (
                        <ScriptItem
                            key={script.id}
                            script={script}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </View>
            )}

            {/* Bottom Spacing */}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f1e',
    },
    contentContainer: {
        padding: 20,
    },
    timerContainer: {
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontVariant: ['tabular-nums'],
    },
    timerLabel: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 8,
    },
    micContainer: {
        marginVertical: 30,
        alignItems: 'center',
    },
    micButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    micButtonStart: {
        backgroundColor: '#00D9E1',
    },
    micButtonRecording: {
        backgroundColor: '#FF4444',
    },
    pausedControls: {
        flexDirection: 'row',
        gap: 20,
    },
    controlButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resumeButton: {
        backgroundColor: '#00D9E1',
    },
    stopButton: {
        backgroundColor: '#FF4444',
    },
    finishedIcon: {
        marginVertical: 10,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 15,
        color: '#FFFFFF',
        marginBottom: 10,
        fontWeight: '600',
    },
    titleInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 14,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    textInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 15,
        minHeight: 140,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    actionButtons: {
        width: '100%',
        gap: 12,
    },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: '#00D9E1',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    resetButton: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    savedScriptsSection: {
        width: '100%',
        marginTop: 40,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
