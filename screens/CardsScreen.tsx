import * as React from 'react';
import {StyleSheet} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import Cards from '../components/Cards';
import {Button, ThemeProvider} from 'react-native-elements';

export default class CardsScreen extends React.Component {

    constructor(props) {
        super(props);
        const {tag} = props.route.params
        this.state = {
            tag: tag,
        };
    }

    render() {
        return (
            <ThemeProvider>
                <Cards tag={this.state.tag}></Cards>
            </ThemeProvider>
        );
    }
}
