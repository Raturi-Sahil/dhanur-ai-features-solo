import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FeatureCardData } from '../types';

interface FeatureCardProps {
    data: FeatureCardData;
    onPress?: () => void;
}

export default function FeatureCard({ data, onPress }: FeatureCardProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <LinearGradient
                colors={data.gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                {/* Icon Circle */}
                <View style={[styles.iconCircle, { backgroundColor: data.iconColor }]}>
                    <Ionicons name={data.iconName as any} size={32} color="#FFFFFF" />
                </View>

                {/* Title */}
                <Text style={styles.title}>{data.title}</Text>

                {/* Description */}
                <Text style={styles.description}>{data.description}</Text>

                {/* Features List */}
                <View style={styles.featuresList}>
                    {data.features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                            <Text style={styles.featureText}>{feature.text}</Text>
                        </View>
                    ))}
                </View>

                {/* Arrow Button */}
                <View style={styles.arrowButton}>
                    <Ionicons name="arrow-forward-circle" size={32} color="#FFFFFF" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 24,
        marginHorizontal: 20,
        marginVertical: 10,
        minHeight: 200,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        opacity: 0.9,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 16,
        lineHeight: 20,
    },
    featuresList: {
        marginBottom: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        fontSize: 15,
        color: '#FFFFFF',
        marginLeft: 8,
        fontWeight: '500',
    },
    arrowButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
});
