export type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
  Login: undefined;
  Register: undefined;
  Verify: { userId: string };
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Details: undefined;
  Map: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}