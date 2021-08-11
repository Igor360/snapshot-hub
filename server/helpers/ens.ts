import ENS from '@ensdomains/ensjs';
import snapshot from '@snapshot-labs/snapshot.js';
import gateways from '@snapshot-labs/snapshot.js/src/gateways.json';

const gateway = gateways[0];

export async function uriGet(
  gateway: string,
  key: string,
  protocolType = 'ipfs'
) {
  // key = key.replace(
  //   'storage.snapshot.page',
  //   'storageapi.fleek.co/snapshot-team-bucket'
  // );
  // if (key.includes('storageapi.fleek.co')) protocolType = 'https';
  // let url = `https://${gateway}/${protocolType}/${key}`;
  // if (['https', 'http'].includes(protocolType))
  //   url = `${protocolType}://${key}`;
  // console.log(url);
  return {
    strategies: [
      {
        name: 'erc20-balance-of',
        params: {
          symbol: 'PAYB',
          address: '0x8F1314124158203aC89121458c131dC857F5d520',
          decimals: 18
        }
      }
    ],
    plugins: {},
    filters: {minScore: 0, onlyMembers: true},
    validation: {name: 'basic', params: {}},
    name: 'build_',
    avatar: '',
    about: 'Swap paltform',
    network: '4',
    twitter: '',
    symbol: 'PAYB',
    domain: 'https://ha8mqwcnfna8.corp.merehead.xyz/',
    members: [],
    admins: ['0x621564D4c278E94bc657631FBbF851DdDAB63184']
  };
}

export async function getSpaceUriFromContentHash(id) {
  let uri: any = false;
  const provider = snapshot.utils.getProvider('4');
  try {
    const ensAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
    const ens = new ENS({ provider, ensAddress });
    uri = await ens.name(id).getContent();
    uri = uri.value;
  } catch (e) {
    console.log('getSpaceUriFromContentHash failed', id, e);
  }
  return uri;
}

export async function getSpaceUriFromTextRecord(id) {
  let uri: any = false;
  const provider = snapshot.utils.getProvider('4');
  try {
    const ensAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
    const ens = new ENS({ provider, ensAddress });
    console.log(await ens.name(id));
    uri = await ens.name(id).getText('snapshot');
  } catch (e) {
    console.log('getSpaceUriFromTextRecord failed', id, e);
  }
  return uri;
}

export async function getSpaceUri(id) {
  let uri = await getSpaceUriFromTextRecord(id);
  if (!uri) uri = await getSpaceUriFromContentHash(id);
  return uri;
}

export async function getSpace(id) {
  let space: any = false;
  const uri: any = await getSpaceUri(id);
  if (uri) {
    try {
      const [protocolType, key] = uri.split('://');
      space = await uriGet(gateway, key, protocolType);
    } catch (e) {
      console.log('getSpace failed', id, e);
    }
  }
  return space;
}
