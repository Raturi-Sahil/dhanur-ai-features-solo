import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FeatureCard from '../components/FeatureCard';
import { FeatureCardData, RootTabParamList } from '../types';

type HomeScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const voiceRecorderCard: FeatureCardData = {
        title: 'Voice Script Recorder',
        description: 'Speak your script and convert it to text. Record, pause, and edit your content seamlessly.',
        features: [
            { icon: 'checkmark-circle', text: 'Voice to Text' },
            { icon: 'checkmark-circle', text: 'Pause & Resume' },
            { icon: 'checkmark-circle', text: 'Edit Manually' },
        ],
        gradientColors: ['#8B7FDE', '#6B5FCE'],
        iconName: 'mic',
        iconColor: 'rgba(255,255,255,0.25)',
    };

    const teleprompterCard: FeatureCardData = {
        title: 'Teleprompter',
        description: 'Read your script with customizable speed, text size, and mirror mode for professional recordings.',
        features: [
            { icon: 'checkmark-circle', text: 'Auto Scroll' },
            { icon: 'checkmark-circle', text: 'Mirror/Flip Text' },
            { icon: 'checkmark-circle', text: 'Speed Control' },
        ],
        gradientColors: ['#00D9E1', '#00B8D4'],
        iconName: 'tv',
        iconColor: 'rgba(255,255,255,0.25)',
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Time */}
            <Text style={styles.time}>
                {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })}
            </Text>

            {/* Feature Cards */}
            <FeatureCard
                data={voiceRecorderCard}
                onPress={() => navigation.navigate('Record')}
            />

            <FeatureCard
                data={teleprompterCard}
                onPress={() => navigation.navigate('Teleprompter')}
            />

            {/* Quick Tips Section */}
            <View style={styles.quickTipsSection}>
                <View style={styles.quickTipsHeader}>
                    <Ionicons name="bulb" size={20} color="#FFD700" />
                    <Text style={styles.quickTipsTitle}>Quick Tips</Text>
                </View>

                <View style={styles.tipsContainer}>
                    <Text style={styles.tipText}>• Tap the mic icon to start recording your script</Text>
                    <Text style={styles.tipText}>• Use teleprompter for hands-free script reading</Text>
                    <Text style={styles.tipText}>• Adjust scroll speed for comfortable reading pace</Text>
                </View>
            </View>

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
    time: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 5,
        fontWeight: '500',
    },
    quickTipsSection: {
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
    },
    quickTipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    quickTipsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    tipsContainer: {
        paddingLeft: 8,
    },
    tipText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 8,
        lineHeight: 20,
    },
});
