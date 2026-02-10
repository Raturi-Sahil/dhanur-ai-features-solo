import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import RecorderScreen from '../screens/RecorderScreen';
import TeleprompterScreen from '../screens/TeleprompterScreen';
import { RootTabParamList } from '../types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#1a1a2e',
                    borderTopColor: 'rgba(255,255,255,0.1)',
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: '#00D9E1',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
                headerStyle: {
                    backgroundColor: '#1a1a2e',
                },
                headerTintColor: '#FFFFFF',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Record"
                component={RecorderScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="mic" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Teleprompter"
                component={TeleprompterScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="tv" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
