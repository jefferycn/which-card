import * as React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';

import {SearchBar, ThemeProvider} from 'react-native-elements';
import * as Data from '../constants/Data.json';
import TouchableScale from 'react-native-touchable-scale';
import {ListItem, Text} from 'react-native-elements'
import {tag, offer} from '../types';
import HelperService from '../services/HelperService';

export default class TabOneScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            action: 'super_market',
            search: '',
        };
    }

    updateSearch = (search: string) => {
        this.setState({search});
    }

    getTags() {
        let tags: string[] = [];
        // if (this.state.search === '') {
        //     tags = [
        //         'super-market',
        //         'gas-station',
        //         'dining',
        //     ];
        // } else {
        // }
        Data.offers.map(offer => {
            if (HelperService.isOfferValid(offer)) {
                tags.push(offer.tag);
            }
        });
        tags = tags.filter(tag => tag.indexOf(this.state.search.toLowerCase()) !== -1);

        return Array.from(new Set(tags));
    }

    getTagName(key: string) {
        const tag = Data.tags.filter((tag: tag) => tag.key === key);
        return tag.length > 0 ? tag[0].name : key;
    }

    getFirstCard(tag: string): offer {
        const offers = Data.offers.filter((offer: offer) => {
            if (offer.tag !== tag) {
                return false;
            }
            return HelperService.isOfferValid(offer);
        });
        offers.sort((a: offer, b: offer) => a.value < b.value ? 1 : (a.value > b.value ? -1 : 0));
        return offers[0];
    }

    renderList() {
        return this.getTags().map((l) => {
            const firstCard = this.getFirstCard(l);
            console.log(firstCard);
            return (
                <ListItem key={l}
                          Component={TouchableScale}
                          friction={90} //
                          tension={100} // These props are passed to the parent component (here TouchableScale)
                          activeScale={0.95} //
                          onPress={() => this.props.navigation.navigate('CardsScreen', {
                              tag: l,
                              headerTitle: this.getTagName(l)
                          })}
                >
                    <ListItem.Content style={styles.subtitleView}>
                        <ListItem.Title>{this.getTagName(l)}</ListItem.Title>
                        <View style={styles.cardView}>
                            <Text style={styles.ratingName}>{firstCard.key}</Text>
                            <Text style={styles.ratingText}>{(firstCard.value + 0).toFixed(2)}%</Text>
                        </View>
                    </ListItem.Content>
                    <ListItem.Chevron/>
                </ListItem>
            );
        });
    }

    render() {
        const {search} = this.state;
        return (
            <ThemeProvider>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={this.updateSearch}
                    value={search}
                />
                <ScrollView>
                    {this.renderList()}
                </ScrollView>
            </ThemeProvider>
        );
    }
}
const styles = StyleSheet.create({
    subtitleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardView: {
        flexDirection: 'row',
    },
    ratingName: {
        paddingRight: 20,
        color: 'grey',
    },
    ratingText: {
        paddingRight: 20,
        color: 'grey',
    }
})