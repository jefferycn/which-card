import React, {Component} from 'react';
import {ListItem, Text} from 'react-native-elements'
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, View} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import * as Data from '../constants/Data.json';
import { card, offer} from '../types';

export default class Cards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: props.tag,
        }
    }

    getCards() {
        const offers = Data.offers.filter((offer: offer) => offer.tag === this.state.tag);
        offers.sort((a: offer, b: offer) => a.value < b.value ? 1 : (a.value > b.value ? -1 : 0));
        return offers;
    }

    getCardName(key: string) {
        const card = Data.cards.filter((card: card) => card.key === key);
        return card ? card[0].name : key;
    }

    renderList() {
        return this.getCards().map((offer: offer) => (
            <ListItem key={offer.key}
                      Component={TouchableScale}
                      friction={90} //
                      tension={100} // These props are passed to the parent component (here TouchableScale)
                      activeScale={0.95} //
            >
                <ListItem.Content style={styles.subtitleView}>
                    <ListItem.Title>{this.getCardName(offer.key)}</ListItem.Title>
                    <ListItem.Subtitle>
                        {offer.start ? offer.start + ' - ' : ''}
                        {offer.expire ? offer.expire : ''}
                    </ListItem.Subtitle>
                    <View>
                        <Text style={styles.ratingText}>{(offer.value + 0).toFixed(2)}%</Text>
                    </View>
                </ListItem.Content>
            </ListItem>
        ));
    }

    render() {
        return (
            <SafeAreaProvider>
                {this.renderList()}
            </SafeAreaProvider>
        );
    }

}

const styles = StyleSheet.create({
    subtitleView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    ratingText: {
        paddingRight: 20,
        color: 'grey'
    }
})