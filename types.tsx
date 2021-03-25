export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
  CardsScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export interface offer {
    key: string,
    tag: string,
    value: number,
    start?: string,
    expire?: string,
}

export interface card {
    key: string,
    name: string,
}

export interface tag {
    key: string;
    name: string;
}
