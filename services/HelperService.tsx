import {offer} from '../types';

export default class HelperService {

    static isExpired(offer: offer): boolean {
        const now = new Date();
        if (offer.expire) {
            const expire = new Date(offer.expire);
            if (expire.getTime() < now.getTime()) {
                return true;
            }
        }
        return false;
    }

    static isStarted(offer: offer): boolean {
        const now = new Date();
        if (offer.start) {
            const start = new Date(offer.start);
            if (start.getTime() > now.getTime()) {
                return false;
            }
        }
        return true;
    }

    static isOfferValid(offer: offer): boolean {
        return !this.isExpired(offer) && this.isStarted(offer);
    }
}