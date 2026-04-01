// playground.ts

import Sangho from ".."

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const sangho = new Sangho("sk_test_Jad_saUtL3sHESJlN4XBGaN-QnNTFs8K9BLYa744daE")

const result = await sangho.apps.list({foo: true});
console.log(result)