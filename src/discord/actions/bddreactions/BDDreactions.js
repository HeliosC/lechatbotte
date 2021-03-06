
/*
This file describe how to react to some messages

How to use this file

This file create an array of reactions, this is how to create/understand one

{
  // If `disabled` is set to `true`, the reaction will never be used
  disabled: Bool

  // If `exception` function exists, the returned value of this function will determine if the reaction should be used
  // if `true` is returned, the reaction will NOT be used
  // if `false` is returned, the reaction WILL be used
  exception: (client, message, memberRoles) -> Bool

  // If the message starts with an element of the `startWith` array, the reaction will be used
  startWith: [String]

  // If the message contains an element of the `contains` array, the reaction will be used
  contains: [String]

  // If `responseChannel` is set, the String (or returned String) should be send to the channel
  responseChannel: String | (client, message, memberRoles) => String | undefined

  // If `responseReply` is set, the String (or returned String) should be used to reply to the message
  responseReply: String | (client, message, memberRoles) => String | undefined

  // If `responseReact` is set, the Emoji (or returned Emoji) should be used as a reaction to the message
  responseReact: Emoji | (client, message, memberRoles) => (Emoji | undefined) | undefined
}

Note:
for the function:
- `client` is a Client object from discord.js
- `message` is a Message object from discord.js
- `memberRoles` is an object with the following content: (keys are defined in the `constants.js` file)
    {
      donnator: false,
      subscriber: true,
      ...
    }
 */


module.exports.messagesReactions = [
  {
    startsWith: ["!snap"],
    disabled: true,
    responseChannel: "Tu veux vraiment voir tout le ramassis de merde que j'peux produire ? A tes risques et périls l'ami : chat_desbois"
  }, {
    startsWith: ["!facebook", "!fb"],
    disabled: true,
    responseChannel: "J'suis aussi présente sur le Facebook game, donc viens lâcher un follow, ça mange pas d'chèvres, et ça fait augmenter les stats, donc stop faire ton pd d'homophobe, stp. ♥ https://www.facebook.com/Chatsdesbois/"
  }, {
    startsWith: ["!insta", "!ig"],
    disabled: true,
    responseChannel: "Viens voir mes petites photo de mes chats et autres beautés artistiques ! ♥ https://www.instagram.com/unejeune/"
  }, {
    startsWith: ["!twitter"],
    disabled: true,
    responseChannel: "Follow pour suivre mes actus ! ♥ https://twitter.com/Chatdesbois_?lang=fr"
  }, {
    startsWith: ["!lis2"],
    disabled: true,
    responseChannel: "https://www.youtube.com/watch?v=vsZl83ix168&index=2&list=PLJwoNPuLFNbPEgfvRAiQeKWDl8pO4AAWW"
  }, {
    startsWith: ["!code", "!créateur"],
    disabled: true,
    responseChannel: "Vous voulez supporter encore plus le stream ? N'hésitez pas à utiliser le code Créateur : CHAT-DES-BOIS lors de vos prochains achats Fortnite ou sur l'Epic Games Store !"
  }, {
    startsWith: ["!extension"],
    disabled: true,
    responseChannel: "L'EXTENSION à avoir pour entendre ma douce voix et voir des chats trop mimis ! + hyper bien codée, donc WOLA un must have ! > http://bit.ly/2qXtylM"
  }, {
    startsWith: ["!sfr"],
    disabled: true,
    responseChannel: function(client, message) {
      return  "Internet en 2019 chez Chat des bois ça donne quoi? Réponse en 8 minutes 59 ici : >> https://youtu.be/PvUT8C8rZg8 <<"
    }
  }, {
    startsWith: ["!utip"],
    disabled: true,
    responseChannel: function(client, message) {
      return  "Me soutenir sans argent ? uTip est là ! Regarde des publicités et je touche de l'argent ! La thune sera utilisée uniquement pour les giveaways ! Merci pour vous ! ➡️ https://utip.io/chatdesbois"
    }
  }, {
    startsWith: ["!giveaway"],
    disabled: true,
    responseChannel: function(client, message) {
      const dab = client.emojis.find(e => e.name == "LapinDab");
      return "RDV aux 6000 follows ! " + dab;
    }
  }, {
    contains: ["kalista"],
    disabled: true,
    respoinseReply: "kali quoi ?"
  }, {
    contains: ["permis"],
    disabled: true,
    respoinseChannel: "https://www.youtube.com/watch?v=MpQEi1Dw3_k&t=4s&ab_channel=Chatdesbois"
  }, {
    contains: ["ddlc", "doki", "monika", "yuri", "sayori", "natsuki"],
    disabled: false,
    responseReact: function(client, message) {
      return client.emojis.find(e => e.name == "monika");
    }
  }, {
    contains: ["pain au chocolat"],
    disabled: true,
    exception: function(client, message, memberRoles) {
      return memberRoles.moderator || memberRoles.administrator;
    },
    responseReply: "Chocolatine"
  }
];
