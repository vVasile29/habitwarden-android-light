import FontAwesome from '@expo/vector-icons/FontAwesome';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {SplashScreen, Stack} from 'expo-router';
import {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {AuthProvider} from "./context/AuthContext";

export {
    // Catch any errors thron by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    // initialRouteName: '(tabs)',
};

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    return (
        <>
            {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
            {!loaded && <SplashScreen/>}
            {loaded && <RootLayoutNav/>}
        </>
    );
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <>
            <AuthProvider>
                {/*<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>*/}
                <ThemeProvider value={DefaultTheme}>
                    <Stack>
                        <Stack.Screen name="(auth)/login" options={{headerShown: false}}/>
                        <Stack.Screen name="(auth)/register" options={{headerShown: false}}/>
                        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                        <Stack.Screen name="(habits)/water" options={{headerShown: false}}/>
                        <Stack.Screen name="(habits)/squats" options={{headerShown: false}}/>
                        <Stack.Screen name="(habits)/meditation" options={{headerShown: false}}/>
                        <Stack.Screen name="modal" options={{headerShown: true, headerTitle: "Information"}}/>
                    </Stack>
                </ThemeProvider>
            </AuthProvider>
        </>
    );
}
