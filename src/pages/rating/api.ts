import bggXmlApiClient from "bgg-xml-api-client";

export type Items<T> = {
    totalitems: string;
    item: T[];
}

export type Game = {
    "objecttype": 'thing';
    "objectid": string;
    "subtype": 'boardgame' | 'boardgameexpansion' | 'boardgameaccessory' | 'boardgameintegration' | 'boardgamecompilation' | 'boardgameimplementation' | 'rpg' | 'rpgitem' | 'videogame';
    "collid": string;
    "name": {
        "text": string;
        "sortindex": string;
    },
    "yearpublished": number;
    "image": string,
    "thumbnail": string,
    "status": {
        "own": '1' | '0';
        "prevowned": '1' | '0';
        "fortrade": '1' | '0';
        "want": '1' | '0';
        "wanttoplay": '1' | '0';
        "wanttobuy": '1' | '0';
        "wishlist": '1' | '0';
        "preordered": '1' | '0';
    },
    "numplays": number
}

export const getOwnGames =  async (username: string) => {
    const { data } = await bggXmlApiClient.get('collection', { username, excludesubtype: 'boardgameexpansion', own: 1});

    return data as Items<Game>;
}