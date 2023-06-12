import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Link, Tabs} from 'expo-router';
import {Pressable, useColorScheme} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import React from "react";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "black",
                headerStyle: {backgroundColor: "#fd7e14"},
            }}
        >
            <Tabs.Screen
                name="habits"
                options={{
                    tabBarIcon: ({color}) => <AntDesign name="rightcircle" size={25} color={color}/>,
                    tabBarActiveBackgroundColor: "#fd7e14",
                    tabBarInactiveBackgroundColor: "#fd7e14",
                    headerRight: () => (
                        <Link href="/modal" asChild>
                            <Pressable>
                                {({pressed}) => (
                                    <FontAwesome
                                        name="info-circle"
                                        size={25}
                                        color={"black"}
                                        style={{marginRight: 15, opacity: pressed ? 0.5 : 1}}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="statistics"
                options={{
                    tabBarIcon: ({color}) => <AntDesign name="barschart" size={30} color={color}/>,
                    tabBarActiveBackgroundColor: "#fd7e14",
                    tabBarInactiveBackgroundColor: "#fd7e14",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({color}) => <FontAwesome5 name="user-circle" size={26} color={color}/>,
                    tabBarActiveBackgroundColor: "#fd7e14",
                    tabBarInactiveBackgroundColor: "#fd7e14",
                }}
            />
        </Tabs>
    );
}
