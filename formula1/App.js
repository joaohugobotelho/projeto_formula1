
import 'react-native-gesture-handler';

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FavoritosProvider } from './context/FavoritosContext'; 
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Telas
import Inicio from './Telas/Inicio';
import Pilotos from './Telas/Equipes';
import Campeonatos from './Telas/Campeonatos';
import Circuitos from './Telas/Circuitos';
import Pits from './Telas/Pits';
import Favoritos from './Telas/Favoritos';
import Sobre from './Telas/Sobre';

import DetalhesPiloto from './Telas/DetalhesPiloto';
import DetalhesGP from './Telas/DetalhesGP';
//import TesteGemini from './Telas/TesteGemini';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();




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
        name="Favoritos"
        component={Favoritos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Equipes"
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
        name="Pits"
        component={Pits}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="tire"
              color={color}
              size={size}
            />
          ),
        }}
      />

    </Tab.Navigator>
  );
}


function MenuDrawer() {
  return (
    <Drawer.Navigator
      

      screenOptions={{
        headerStyle: {
          backgroundColor: '#151515',
        },

        headerTintColor: '#FFFFFF',

        headerTitleStyle: {
          fontWeight: 'bold',
        },

        drawerStyle: {
          backgroundColor: '#151515',
          width: 280,
        },

        drawerActiveTintColor: '#E10600',
        drawerInactiveTintColor: '#AAAAAA',

        drawerActiveBackgroundColor: '#292929',

        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          marginLeft: -10,
        },
      }}
    >

      <Drawer.Screen
      initialRouteName="Inicio"
        name="Início"
        component={Inicio}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Menu Principal"
        component={MenuPrincipal}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Sobre"
        component={Sobre}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle" color={color} size={size} />
          ),
        }}
      />

    </Drawer.Navigator>
  );
}



export default function App() {
  return (
    <FavoritosProvider>
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
          name="MenuDrawer"
          component={MenuDrawer}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="DetalhesPiloto"
          component={DetalhesPiloto}
          options={{
            title: 'Detalhes do piloto',
          }}
        />

        <Stack.Screen
          name="DetalhesGP"
          component={DetalhesGP}
          options={{
            title: 'Detalhes do Grande Prêmio',
          }}
        />

        
      </Stack.Navigator>

    </NavigationContainer>
    </FavoritosProvider>
    
  );
}
