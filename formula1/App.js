
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';




import Inicio from './Telas/Inicio';
import Pilotos from './Telas/Pilotos';
import Campeonatos from './Telas/Campeonatos';
import Circuitos from './Telas/Circuitos';
import Favoritos from './Telas/Favoritos';
import DetalhesPiloto from './Telas/DetalhesPiloto';
import DetalhesGP from './Telas/DetalhesGP';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MenuPrincipal() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E10600',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#151515',
          borderTopColor: '#333333',
          height: 65,
          paddingBottom: 8,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Início"
        component={Inicio}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Pilotos"
        component={Pilotos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="GPs"
        component={Circuitos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Campeonatos"
        component={Campeonatos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Favoritos"
        component={Favoritos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#151515',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#101010',
          },
        }}
      >
        <Stack.Screen
          name="MenuPrincipal"
          component={MenuPrincipal}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="DetalhesPiloto"
          component={DetalhesPiloto}
          options={{ title: 'Detalhes do piloto' }}
        />

        <Stack.Screen
          name="DetalhesGP"
          component={DetalhesGP}
          options={{ title: 'Detalhes do Grande Prêmio' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
