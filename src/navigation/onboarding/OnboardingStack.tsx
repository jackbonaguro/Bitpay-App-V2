import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import OnboardingStartScreen from './screens/OnboardingStart';
import LoginSignup from './screens/Login-Signup';
import BlockingDemo from './screens/BlockingDemo';

export type OnboardingStackParamList = {
  OnboardingStart: undefined;
  LoginSignup: {context: 'login' | 'signup'};
  BlockingDemo: undefined;
};

export enum OnboardingScreens {
  ONBOARDING_START = 'OnboardingStart',
  LOGIN_SIGNUP = 'LoginSignup',
  BLOCKING_DEMO = 'BlockingDemo',
}

const Onboarding = createStackNavigator<OnboardingStackParamList>();

const OnboardingStack = () => {
  return (
    <Onboarding.Navigator
      screenOptions={{
        header: () => null,
      }}
      initialRouteName="OnboardingStart">
      <Onboarding.Screen
        name={OnboardingScreens.ONBOARDING_START}
        component={OnboardingStartScreen}
      />
      <Onboarding.Screen
        name={OnboardingScreens.LOGIN_SIGNUP}
        component={LoginSignup}
      />
      <Onboarding.Screen
        name={OnboardingScreens.BLOCKING_DEMO}
        component={BlockingDemo}
      />
    </Onboarding.Navigator>
  );
};

export default OnboardingStack;
