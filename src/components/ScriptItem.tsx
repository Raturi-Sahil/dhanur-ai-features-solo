import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Script } from '../types';

interface ScriptItemProps {
    script: Script;
    onEdit: (script: Script) => void;
    onDelete: (id: string) => void;
}

export default function ScriptItem({ script, onEdit, onDelete }: ScriptItemProps) {
    const handleDelete = () => {
        Alert.alert(
            'Delete Script',
            'Are you sure you want to delete this script?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDelete(script.id),
                },
            ]
        );
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>
                    {script.title}
                </Text>
                <Text style={styles.preview} numberOfLines={2}>
                    {script.content}
                </Text>
                <Text style={styles.date}>{formatDate(script.createdAt)}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onEdit(script)}
                >
                    <Ionicons name="create-outline" size={22} color="#00D9E1" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleDelete}
                >
                    <Ionicons name="trash-outline" size={22} color="#FF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    preview: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 6,
        lineHeight: 18,
    },
    date: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 8,
    },
});
