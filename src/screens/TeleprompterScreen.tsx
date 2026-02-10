import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Script } from '../types';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';



export default function TeleprompterScreen() {
    const scrollViewRef = useRef(null);
    const scrollPosition = useRef(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [scripts, setScripts] = useState<Script[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const currentScript = scripts[selectedIndex] || null;
    const navigation = useNavigation();
    const [showSettings, setShowSettings] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(2); // pixels per interval
    const [fontSize, setFontSize] = useState(28);     // font size in px
    const [isMirrored, setIsMirrored] = useState(false); // mirror mode for front camera

    // Add settings button to header
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => setShowSettings(!showSettings)}
                    style={{ marginRight: 16 }}
                >
                    <Ionicons name="settings-outline" size={24} color="#00D9E1" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, showSettings]);

    const handlePrevScript = () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const handleNextScript = () => {
        if (selectedIndex < scripts.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    useEffect(() => {
        let interval: any;
        if (isScrolling) {
            interval = setInterval(() => {
                scrollPosition.current += scrollSpeed;  // Dynamic speed!
                scrollViewRef.current.scrollTo({ y: scrollPosition.current, animated: false });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isScrolling])

    const handleReset = () => {
        scrollPosition.current = 0;
        scrollViewRef.current.scrollTo({ y: 0, animated: true })
        setIsScrolling(false);
    }

    useFocusEffect(
        useCallback(() => {
            const loadScripts = async () => {
                const data = await AsyncStorage.getItem('@scripts');
                if (data) {
                    const parsedScripts = JSON.parse(data);
                    setScripts(parsedScripts);
                }
            };
            loadScripts();
        }, [])
    );

    return (
        <View style={styles.container}>
            {showSettings && (
                <View style={styles.settingsPanel}>
                    <Text style={styles.settingLabel}>Speed: {scrollSpeed}x</Text>
                    <View style={styles.controlRow}>
                        <TouchableOpacity style={styles.controlButton} onPress={() => setScrollSpeed(Math.max(0.5, scrollSpeed - 0.5))}>
                            <Ionicons name="remove" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <View style={styles.controlBar}>
                            <View style={[styles.controlFill, { width: `${(scrollSpeed / 5) * 100}%` }]} />
                        </View>
                        <TouchableOpacity style={styles.controlButton} onPress={() => setScrollSpeed(Math.min(5, scrollSpeed + 0.5))}>
                            <Ionicons name="add" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.settingLabel}>Font Size: {fontSize}px</Text>
                    <View style={styles.controlRow}>
                        <TouchableOpacity style={styles.controlButton} onPress={() => setFontSize(Math.max(16, fontSize - 4))}>
                            <Ionicons name="remove" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <View style={styles.controlBar}>
                            <View style={[styles.controlFill, { width: `${((fontSize - 16) / 48) * 100}%` }]} />
                        </View>
                        <TouchableOpacity style={styles.controlButton} onPress={() => setFontSize(Math.min(64, fontSize + 4))}>
                            <Ionicons name="add" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.settingLabel}>Mirror Mode</Text>
                    <TouchableOpacity
                        style={[styles.mirrorToggle, isMirrored && styles.mirrorToggleActive]}
                        onPress={() => setIsMirrored(!isMirrored)}
                    >
                        <Ionicons name="swap-horizontal" size={24} color={isMirrored ? "#00D9E1" : "#FFFFFF"} />
                        <Text style={[styles.mirrorText, isMirrored && styles.mirrorTextActive]}>
                            {isMirrored ? 'ON' : 'OFF'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <ScrollView
                ref={scrollViewRef}
                style={[
                    styles.scrollView,
                    isMirrored && { transform: [{ scaleX: -1 }] }
                ]}
                contentContainerStyle={styles.contentContainer}
            >
                <Text style={[styles.text, { fontSize }]}>{currentScript?.content || "No scripts yet!"}</Text>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setIsScrolling(!isScrolling)}>
                    <Text style={styles.buttonText}>{isScrolling ? 'Stop' : 'Start'}</Text>
                </TouchableOpacity>

                <View style={styles.scriptNavigator}>
                    <TouchableOpacity onPress={handlePrevScript} style={styles.navButton}>
                        <Text style={styles.arrow}>{'<'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.scriptTitle} numberOfLines={1}>{currentScript?.title || 'No Script'}</Text>
                    <TouchableOpacity onPress={handleNextScript} style={styles.navButton}>
                        <Text style={styles.arrow}>{'>'}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleReset}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f1e',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 48,
    },
    text: {
        fontFamily: 'jost_400Regular',
        fontSize: 28,
        fontWeight: '600',
        color: '#F5F5F5',
        textAlign: 'center',
        lineHeight: 42,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderTopWidth: 2,
        borderTopColor: 'rgba(0, 217, 225, 0.4)',
        shadowColor: '#00D9E1',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    button: {
        backgroundColor: '#00B8D4',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#00D9E1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scriptNavigator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 217, 225, 0.15)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 12,
        gap: 10,
        flex: 1,
        marginHorizontal: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(0, 217, 225, 0.4)',
    },
    navButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 184, 212, 0.2)',
        minWidth: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 217, 225, 0.5)',
    },
    arrow: {
        color: '#00D9E1',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scriptTitle: {
        color: '#F5F5F5',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    textEditor: {
        height: 200,
        backgroundColor: '#272733ff',
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        margin: 10,
    },
    settingsPanel: {
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        padding: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(0, 217, 225, 0.5)',
        shadowColor: '#00D9E1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    settingLabel: {
        color: '#00D9E1',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 10,
        marginTop: 16,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    controlButton: {
        backgroundColor: 'rgba(0, 184, 212, 0.25)',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1.5,
        borderColor: 'rgba(0, 217, 225, 0.6)',
        shadowColor: '#00D9E1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
    },
    controlBar: {
        flex: 1,
        height: 10,
        backgroundColor: 'rgba(0, 184, 212, 0.2)',
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0, 217, 225, 0.4)',
    },
    controlFill: {
        height: '100%',
        backgroundColor: '#00D9E1',
        borderRadius: 5,
        shadowColor: '#00D9E1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
    mirrorToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 184, 212, 0.2)',
        borderRadius: 12,
        padding: 14,
        gap: 10,
        borderWidth: 1.5,
        borderColor: 'rgba(0, 217, 225, 0.5)',
    },
    mirrorToggleActive: {
        backgroundColor: 'rgba(0, 217, 225, 0.25)',
        borderColor: '#00D9E1',
        shadowColor: '#00D9E1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
    mirrorText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    mirrorTextActive: {
        color: '#00D9E1',
    },
});
